const querystring = require('querystring');
const { Op } = require('sequelize');
const url = require('url');
const WebSocket = require('ws');
const DeliveryStatus = require('../shared/constants/DeliveryStatus');
const models = require('./models');

const userServer = new WebSocket.Server({ noServer: true });
userServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { userId: req.user.id, organizationId: req.user.OrganizationId };
  // eslint-disable-next-line no-use-before-define
  const data = await getRingdownData(req.user.id);
  ws.send(data);
});

const hospitalServer = new WebSocket.Server({ noServer: true });
hospitalServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { userId: req.user.id, hospitalId: req.hospital.id };
  // eslint-disable-next-line no-use-before-define
  const data = await getStatusUpdateData(req.hospital.id);
  ws.send(data);
});

async function getRingdownData(userId, cachedStatusUpdates) {
  const patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      ParamedicUserId: userId,
      currentDeliveryStatus: {
        [Op.lt]: DeliveryStatus.RETURNED_TO_SERVICE,
      },
    },
  });
  const data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
    statusUpdates:
      cachedStatusUpdates ||
      (await Promise.all(
        (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
      )),
  });
  return data;
}

async function getStatusUpdateData(hospitalId) {
  /// dispatch to all clients watching this hospital's ringdowns
  const patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      HospitalId: hospitalId,
      currentDeliveryStatus: {
        [Op.notIn]: [
          DeliveryStatus.RETURNED_TO_SERVICE,
          DeliveryStatus.CANCEL_ACKNOWLEDGED,
          DeliveryStatus.REDIRECT_ACKNOWLEDGED,
          DeliveryStatus.OFFLOADED_ACKNOWLEDGED,
        ],
      },
    },
  });
  const statusUpdate = await models.HospitalStatusUpdate.scope('latest').findOne({
    where: {
      HospitalId: hospitalId,
    },
  });
  const data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
    statusUpdate: await statusUpdate.toJSON(),
  });
  return data;
}

async function dispatchStatusUpdate(hospitalId) {
  // dispatch to all user clients
  const cachedStatusUpdates = await Promise.all(
    (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
  );
  const userPromises = [];
  userServer.clients.forEach((ws) => {
    userPromises.push(
      getRingdownData(ws.info.userId, cachedStatusUpdates).then((data) => {
        ws.send(data);
      })
    );
  });
  await Promise.all(userPromises);
  // dispatch to all clients watching this hospital's ringdowns
  const data = await getStatusUpdateData(hospitalId);
  hospitalServer.clients.forEach((ws) => {
    if (ws.info.hospitalId === hospitalId) {
      ws.send(data);
    }
  });
}

async function dispatchRingdownUpdate(patientDeliveryId) {
  // dispatch to all clients watching this user's ringdowns
  const patientDelivery = await models.PatientDelivery.findByPk(patientDeliveryId);
  const userId = patientDelivery.ParamedicUserId;
  const data = await getRingdownData(userId);
  userServer.clients.forEach((ws) => {
    if (ws.info.userId === userId) {
      ws.send(data);
    }
  });
  // dispatch to all clients watching this hospital's ringdowns
  await dispatchStatusUpdate(patientDelivery.HospitalId);
}

function getActiveHospitalUsers(hospitalId) {
  const userIds = [];
  hospitalServer.clients.forEach((ws) => {
    if (ws.info.hospitalId === hospitalId) {
      userIds.push(ws.info.userId);
    }
  });
  return userIds;
}

function getActiveOrganizationUsers(organizationId) {
  const userIds = [];
  userServer.clients.forEach((ws) => {
    if (ws.info.organizationId === organizationId) {
      userIds.push(ws.info.userId);
    }
  });
  return userIds;
}

function configure(server, app) {
  server.on('upgrade', (req, socket, head) => {
    app.sessionParser(req, {}, async () => {
      const query = querystring.parse(url.parse(req.url).query);
      /// ensure user logged in
      if (req.session?.passport?.user) {
        req.user = await models.User.findByPk(req.session.passport.user);
      }
      if (!req.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
      /// connect based on pathname
      const { pathname } = url.parse(req.url);
      switch (pathname) {
        case '/wss/user':
          userServer.handleUpgrade(req, socket, head, (ws) => {
            userServer.emit('connection', ws, req);
          });
          break;
        case '/wss/hospital':
          /// ensure valid hospital
          if (query.id && query.id !== 'undefined') {
            req.hospital = await models.Hospital.findByPk(query.id);
          }
          if (!req.hospital) {
            socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
            socket.destroy();
            return;
          }
          hospitalServer.handleUpgrade(req, socket, head, (ws) => {
            hospitalServer.emit('connection', ws, req);
          });
          break;
        default:
          socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
          socket.destroy();
      }
    });
  });
}

module.exports = {
  configure,
  dispatchRingdownUpdate,
  dispatchStatusUpdate,
  getActiveHospitalUsers,
  getActiveOrganizationUsers,
};

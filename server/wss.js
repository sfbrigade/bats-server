const querystring = require('querystring');
const { Op } = require('sequelize');
const url = require('url');
const WebSocket = require('ws');
const { DeliveryStatus } = require('shared/constants');
const models = require('./models');

const mciServer = new WebSocket.Server({ noServer: true });
mciServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { useId: req.user.id };
  // eslint-disable-next-line no-use-before-define
  const data = await getMciData();
  ws.send(data);
});

const userServer = new WebSocket.Server({ noServer: true });
userServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { userId: req.user.id, organizationId: req.user.OrganizationId, venueId: req.venue?.id };
  // eslint-disable-next-line no-use-before-define
  const data = await getRingdownData(req.user.id, req.venue?.id);
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

async function getMciData(cachedMcis, cachedStatusUpdates, mciId) {
  const mcis = cachedMcis || (await models.MassCasualtyIncident.scope('active').findAll()).map((mci) => mci.toJSON());
  if (mciId) {
    if (!mcis.find((mci) => mci.id === mciId)) {
      const mci = await models.MassCasualtyIncident.findByPk(mciId);
      mcis.push(mci.toJSON());
    }
  }
  await Promise.all(
    mcis.map(async (mci) => {
      mci.ringdowns = await Promise.all(
        (
          await models.PatientDelivery.findAll({
            include: [
              { model: models.Ambulance, include: models.Organization },
              models.Hospital,
              models.PatientDeliveryUpdate,
              {
                model: models.Patient,
                include: models.EmergencyMedicalServiceCall,
              },
            ],
            where: {
              currentDeliveryStatus: {
                [Op.lt]: DeliveryStatus.CANCELLED,
              },
              '$Patient.EmergencyMedicalServiceCall.dispatchcallnumber$': mci.incidentNumber,
            },
          })
        ).map((pd) => pd.toRingdownJSON())
      );
    })
  );
  const data = JSON.stringify({
    mcis,
    statusUpdates:
      cachedStatusUpdates ||
      (await Promise.all(
        (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
      )),
  });
  return data;
}

async function getRingdownData(userId, venueId, cachedMcis, cachedStatusUpdates) {
  const patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      ParamedicUserId: userId,
      currentDeliveryStatus: {
        [Op.lt]: DeliveryStatus.RETURNED_TO_SERVICE,
      },
    },
  });
  const data = {
    mcis: cachedMcis || (await models.MassCasualtyIncident.scope('active').findAll()).map((mci) => mci.toJSON()),
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
    statusUpdates:
      cachedStatusUpdates ||
      (await Promise.all(
        (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
      )),
  };
  if (venueId) {
    const statusUpdates = await Promise.all(
      (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts(venueId)).map((statusUpdate) => statusUpdate.toJSON())
    );
    data.statusUpdates = statusUpdates.concat(data.statusUpdates);
  }
  return JSON.stringify(data);
}

async function getStatusUpdateData(hospitalId, cachedMcis) {
  // dispatch to all clients watching this hospital's ringdowns
  const options = {
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
  };
  // when specified, return ringdowns across all hospitals for testing
  if (process.env.REACT_APP_PILOT_SHOW_ALL_RINGDOWNS === 'true') {
    delete options.where.HospitalId;
  }
  const patientDeliveries = await models.PatientDelivery.findAll(options);
  const statusUpdate = await models.HospitalStatusUpdate.scope('latest').findOne({
    where: {
      HospitalId: hospitalId,
    },
  });
  const data = JSON.stringify({
    mcis: cachedMcis || (await models.MassCasualtyIncident.scope('active').findAll()).map((mci) => mci.toJSON()),
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
    statusUpdate: await statusUpdate.toJSON(),
  });
  return data;
}

async function dispatchMciUpdate(mciId) {
  // dispatch to all hospitals
  const cachedMcis = (await models.MassCasualtyIncident.scope('active').findAll()).map((mci) => mci.toJSON());
  Promise.all(
    [...hospitalServer.clients].map(async (ws) => {
      const data = await getStatusUpdateData(ws.info.hospitalId, cachedMcis);
      ws.send(data);
    })
  );
  // dispatch to all user clients
  const cachedStatusUpdates = await Promise.all(
    (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
  );
  const userPromises = [];
  userServer.clients.forEach((ws) => {
    userPromises.push(
      getRingdownData(ws.info.userId, ws.info.venueId, cachedMcis, cachedStatusUpdates).then((data) => {
        ws.send(data);
      })
    );
  });
  // dispatch to all watching mcis
  const data = await getMciData(cachedMcis, cachedStatusUpdates, mciId);
  mciServer.clients.forEach((ws) => {
    ws.send(data);
  });
  return Promise.all(userPromises);
}

async function dispatchStatusUpdate(hospitalId) {
  // dispatch to all user clients
  const cachedMcis = (await models.MassCasualtyIncident.scope('active').findAll()).map((mci) => mci.toJSON());
  const cachedStatusUpdates = await Promise.all(
    (await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts()).map((statusUpdate) => statusUpdate.toJSON())
  );
  const userPromises = [];
  userServer.clients.forEach((ws) => {
    userPromises.push(
      getRingdownData(ws.info.userId, ws.info.venueId, cachedMcis, cachedStatusUpdates).then((data) => {
        ws.send(data);
      })
    );
  });
  await Promise.all(userPromises);
  // dispatch to all clients watching this hospital's ringdowns
  const data = await getStatusUpdateData(hospitalId, cachedMcis);
  hospitalServer.clients.forEach((ws) => {
    // when showing ringdowns across all hospitals for testing, send
    // ringdown updates to all hospitals
    if (process.env.REACT_APP_PILOT_SHOW_ALL_RINGDOWNS === 'true') {
      ws.send(data);
    } else if (ws.info.hospitalId === hospitalId) {
      ws.send(data);
    }
  });
  // dispatch to all active MCIs
  await Promise.all(
    [...mciServer.clients].map(async (ws) => {
      const data = await getMciData(cachedMcis, cachedStatusUpdates);
      ws.send(data);
    })
  );
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
      // ensure user logged in
      if (req.session?.passport?.user) {
        req.user = await models.User.findByPk(req.session.passport.user);
      }
      if (!req.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
      // connect based on pathname
      const { pathname } = url.parse(req.url);
      switch (pathname) {
        case '/wss/mci':
          if (!req.user.isSuperUser) {
            const org = await req.user.getOrganization();
            if (org.type !== 'C4SF') {
              socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
              socket.destroy();
              return;
            }
          }
          mciServer.handleUpgrade(req, socket, head, (ws) => {
            mciServer.emit('connection', ws, req);
          });
          break;
        case '/wss/user':
          if (query.venueId && query.venueId !== 'undefined') {
            req.venue = await models.Organization.findByPk(query.venueId);
            if (!req.venue) {
              socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
              socket.destroy();
              return;
            }
          }
          userServer.handleUpgrade(req, socket, head, (ws) => {
            userServer.emit('connection', ws, req);
          });
          break;
        case '/wss/hospital':
          // ensure valid hospital
          if (query.id && query.id !== 'undefined') {
            const hospital = await models.Hospital.findByPk(query.id);
            // check if user is allowed to view this hospital
            const assignment = await models.Assignment.findOne({
              where: {
                ToOrganizationId: hospital.OrganizationId,
                FromOrganizationId: req.user.OrganizationId,
              },
            });
            if (assignment) {
              req.hospital = hospital;
            }
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
  dispatchMciUpdate,
  dispatchRingdownUpdate,
  dispatchStatusUpdate,
  getActiveHospitalUsers,
  getActiveOrganizationUsers,
};

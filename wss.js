const querystring = require('querystring');
const { Op } = require('sequelize');
const url = require('url');
const WebSocket = require('ws');

const models = require('./models');

const userServer = new WebSocket.Server({ noServer: true });

userServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { userId: req.user.id };
  const patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      ParamedicUserId: req.user.id,
      deliveryStatus: {
        [Op.lt]: 'RETURNED TO SERVICE',
      },
    },
  });
  const data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
  });
  ws.send(data);
});

const hospitalServer = new WebSocket.Server({ noServer: true });

hospitalServer.on('connection', async (ws, req) => {
  // eslint-disable-next-line no-param-reassign
  ws.info = { userId: req.user.id, hospitalId: req.hospital.id };
  const patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      HospitalId: req.hospital.id,
      deliveryStatus: {
        [Op.lt]: 'RETURNED TO SERVICE',
      },
    },
  });
  const data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
  });
  ws.send(data);
});

const dispatchRingdownUpdate = async (patientDeliveryId) => {
  /// dispatch to all clients watching this user's ringdowns
  const patientDelivery = await models.PatientDelivery.findByPk(patientDeliveryId);
  const userId = patientDelivery.ParamedicUserId;
  let patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      ParamedicUserId: userId,
      deliveryStatus: {
        [Op.lt]: 'RETURNED TO SERVICE',
      },
    },
  });
  let data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
  });
  userServer.clients.forEach((ws) => {
    if (ws.info.userId === userId) {
      ws.send(data);
    }
  });
  /// dispatch to all clients watching this hospital's ringdowns
  const hospitalId = patientDelivery.HospitalId;
  patientDeliveries = await models.PatientDelivery.findAll({
    include: { all: true },
    where: {
      HospitalId: hospitalId,
      deliveryStatus: {
        [Op.lt]: 'RETURNED TO SERVICE',
      },
    },
  });
  data = JSON.stringify({
    ringdowns: await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())),
  });
  hospitalServer.clients.forEach((ws) => {
    if (ws.info.hospitalId === hospitalId) {
      ws.send(data);
    }
  });
};

const configure = (server, app) => {
  server.on('upgrade', (req, socket, head) => {
    app.sessionParser(req, {}, async () => {
      const query = querystring.parse(url.parse(req.url).query);
      /// ensure user logged in
      if (req.session?.passport?.user) {
        req.user = await models.User.findByPk(req.session.passport.user);
      }
      if (!req.user) {
        socket.destroy();
        return;
      }
      /// connect based on pathname
      const { pathname } = url.parse(req.url);
      switch (pathname) {
        case '/user':
          userServer.handleUpgrade(req, socket, head, (ws) => {
            userServer.emit('connection', ws, req);
          });
          break;
        case '/hospital':
          /// ensure valid hospital
          if (query.id && query.id !== 'undefined') {
            req.hospital = await models.Hospital.findByPk(query.id);
          }
          if (!req.hospital) {
            socket.destroy();
            return;
          }
          hospitalServer.handleUpgrade(req, socket, head, (ws) => {
            hospitalServer.emit('connection', ws, req);
          });
          break;
        default:
          socket.destroy();
      }
    });
  });
};

module.exports = {
  configure,
  dispatchRingdownUpdate,
};

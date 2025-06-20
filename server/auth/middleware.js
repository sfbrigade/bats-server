const HttpStatus = require('http-status-codes');

const models = require('../models');

async function checkAuthorizationHeader(req, res, next) {
  if (!req.user) {
    const { authorization } = req.headers;
    if (authorization?.startsWith('Bearer ')) {
      const accessToken = authorization.substring(7).trim();
      const token = await models.Token.findOne({
        include: { model: models.User, as: 'user' },
        where: { accessToken },
      });
      if (token) {
        if (token.accessTokenExpiresAt < new Date()) {
          res.status(HttpStatus.UNAUTHORIZED).end();
          // clean up expired tokens
          await models.Token.destroy({
            where: {
              accessTokenExpiresAt: {
                [models.Sequelize.Op.lt]: new Date(),
              },
              [models.Sequelize.Op.or]: [
                {
                  refreshTokenExpiresAt: null,
                },
                {
                  refreshTokenExpiresAt: {
                    [models.Sequelize.Op.lt]: new Date(),
                  },
                },
              ],
            },
          });
          return;
        }
        req.user = token.user;
        req.session.twoFactor = true;
      }
    }
  }
  next();
}

function isAuthenticated(req, res, next) {
  if (req.user) {
    // ensure authenticated user is active
    if (!req.user.isActive) {
      res.status(HttpStatus.FORBIDDEN).end();
    } else if (!req.session.twoFactor) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      next();
    }
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
}

function isSuperUser(req, res, next) {
  if (req.user?.isSuperUser) {
    if (!req.session.twoFactor) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else next();
  } else if (req.user) {
    res.status(HttpStatus.FORBIDDEN).end();
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
}

function isAdminUser(req, res, next) {
  if (req.user?.isSuperUser || req.user?.isAdminUser) {
    if (!req.session.twoFactor) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else next();
  } else if (req.user) {
    res.status(HttpStatus.FORBIDDEN).end();
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
}

async function isC4SFUser(req, res, next) {
  if (!req.user) {
    res.status(HttpStatus.UNAUTHORIZED).end();
    return;
  }
  if (!req.user.isSuperUser) {
    const org = await req.user?.getOrganization();
    if (org.type !== 'C4SF') {
      res.status(HttpStatus.FORBIDDEN).end();
      return;
    }
  }
  next();
}

module.exports = {
  checkAuthorizationHeader,
  isAdminUser,
  isAuthenticated,
  isC4SFUser,
  isSuperUser,
};

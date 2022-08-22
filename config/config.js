const { NODE_ENV, DATABASE_LOGGING, DATABASE_URL } = process.env;
const loggingByEnv = {
  development: true,
  test: false,
  production: false,
};
const logging =
  typeof DATABASE_LOGGING === 'string' && DATABASE_LOGGING
    ? DATABASE_LOGGING === 'true'
    : // if the key is undefined or empty, set logging based on the environment
      loggingByEnv[NODE_ENV];

process.env.DATABASE_TEST_URL = `${DATABASE_URL}_test`;

module.exports = {
  development: {
    logging,
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  test: {
    logging,
    use_env_variable: 'DATABASE_TEST_URL',
    dialect: 'postgres',
  },
  production: {
    logging,
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // false === allow self-signed SSL certs
      },
    },
  },
};

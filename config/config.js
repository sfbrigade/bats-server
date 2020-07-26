process.env.DATABASE_TEST_URL = `${process.env.DATABASE_URL}_test`;

module.exports = {
  "development": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
  },
  "test": {
    "use_env_variable": "DATABASE_TEST_URL",
    "logging": false,
    "dialect": "postgres",
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "logging": false,
    "dialect": "postgres",
  }
};

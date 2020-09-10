module.exports = {
  up: async (queryInterface) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS citext;'
    );
    await queryInterface.sequelize.query(`
      --
      -- ER/Studio Data Architect SQL Code Generation
      -- Project :      BATS Logical Data Model.DM1
      --
      -- Date Created : Sunday, August 16, 2020 07:15:27
      -- Target DBMS : PostgreSQL 9.x
      --
      
      -- 
      -- TABLE: batsuser 
      --

      CREATE TABLE batsuser(
          user_uuid               uuid             NOT NULL,
          firstname               varchar(50)      NOT NULL,
          lastname                varchar(50)      NOT NULL,
          email                   citext,
          subjectid               varchar(100),
          hashedpassword          varchar(100),
          ssodata                 jsonb,
          superuserindicator      boolean          NOT NULL,
          recordcreatetimestamp   timestamp        NOT NULL,
          recordupdatetimestamp   timestamp        NOT NULL
      )
      ;
    `);
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE batsuser ADD CONSTRAINT emailuk UNIQUE (email);'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE batsuser ALTER COLUMN user_uuid SET DEFAULT gen_random_uuid();'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE batsuser ALTER COLUMN superuserindicator SET DEFAULT FALSE;'
    );
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('batsuser');
  },
};

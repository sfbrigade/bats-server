"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`
      -- ER/Studio Data Architect SQL Code Generation
      -- Project :      BATS Logical Data Model.DM1
      --
      -- Date Created : Sunday, August 02, 2020 18:13:09
      -- Target DBMS : PostgreSQL 9.x
      --
      -- 
      -- TABLE: ambulance 
      --
      CREATE TABLE ambulance(
          ambulance_uuid                          uuid           NOT NULL,
          emergencymedicalserviceprovider_uuid    uuid           NOT NULL,
          ambulanceidentifier                     varchar(50)    NOT NULL,
          recordcreatetimestamp                   timestamp      NOT NULL,
          recordcreatesource                      varchar(50)    NOT NULL,
          recordupdatetimestamp                   timestamp      NOT NULL,
          recordupdatesource                      varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: emergencymedicalservicecall 
      --
      CREATE TABLE emergencymedicalservicecall(
          emergencymedicalservicecall_uuid    uuid           NOT NULL,
          dispatchcallnumber                  int4           NOT NULL,
          startdatetime                       timestamp      NOT NULL,
          recordcreatetimestamp               timestamp      NOT NULL,
          recordcreatesource                  varchar(50)    NOT NULL,
          recordupdatetimestamp               timestamp      NOT NULL,
          recordupdatesource                  varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: emergencymedicalserviceprovider 
      --
      CREATE TABLE emergencymedicalserviceprovider(
          emergencymedicalserviceprovider_uuid    uuid           NOT NULL,
          emergencymedicalserviceprovidername     varchar(40)    NOT NULL,
          recordcreatetimestamp                   timestamp      NOT NULL,
          recordcreatesource                      varchar(50)    NOT NULL,
          recordupdatetimestamp                   timestamp      NOT NULL,
          recordupdatesource                      varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: hospital 
      --
      CREATE TABLE hospital(
          hospital_uuid            varchar(60)    NOT NULL,
          hospitalname             bytea          NOT NULL,
          recordcreatetimestamp    timestamp      NOT NULL,
          recordcreatesource       varchar(50)    NOT NULL,
          recordupdatetimestamp    timestamp      NOT NULL,
          recordupdatesource       varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: hospitaladministrator 
      --
      CREATE TABLE hospitaladministrator(
          hospitaladministrator_uuid         uuid           NOT NULL,
          hospital_uuid                      uuid           NOT NULL,
          hospitaladministratoridentifier    char(10)       NOT NULL,
          firstname                          varchar(50)    NOT NULL,
          lastname                           varchar(50)    NOT NULL,
          recordcreatetimestamp              timestamp      NOT NULL,
          recordcreatesource                 varchar(50)    NOT NULL,
          recordupdatetimestamp              timestamp      NOT NULL,
          recordupdatesource                 varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: hospitalstatusupdate 
      --
      CREATE TABLE hospitalstatusupdate(
          hospitalstatusupdate_uuid             uuid             NOT NULL,
          hospital_uuid                         uuid             NOT NULL,
          updatedatetime                        timestamp        NOT NULL,
          hospitaladministrator_uuid            uuid             NOT NULL,
          openedbedcount                        int2,
          edwaitingroomcount                    int2,
          divertstatusindicator                 boolean          NOT NULL,
          additionalserviceavailabilitynotes    varchar(1000),
          recordcreatetimestamp                 timestamp        NOT NULL,
          recordcreatesource                    varchar(50)      NOT NULL,
          recordupdatetimestamp                 timestamp        NOT NULL,
          recordupdatesource                    varchar(50)      NOT NULL
      )
      ;
      -- 
      -- TABLE: patient 
      --
      CREATE TABLE patient(
          patient_uuid                        uuid             NOT NULL,
          patientnumber                       int4             NOT NULL,
          age                                 int2,
          sex                                 varchar(10),
          stableindicator                     boolean,
          chiefcomplaintdescription           varchar(1000),
          heartratebpm                        int2,
          temperature                         decimal(4, 1),
          systolicbloodpressure               int2,
          diastolicbloodpressure              int2,
          respiratoryrate                     int2,
          oxygensaturation                    int2,
          ivindicator                         boolean,
          combativebehaviorindicator          boolean,
          otherobservationnotes               varchar(1000),
          emergencymedicalservicecall_uuid    uuid             NOT NULL,
          recordcreatetimestamp               timestamp        NOT NULL,
          recordcreatesource                  varchar(50)      NOT NULL,
          recordupdatetimestamp               timestamp        NOT NULL,
          recordupdatesource                  varchar(50)      NOT NULL
      )
      ;
      -- 
      -- TABLE: patientdelivery 
      --
      CREATE TABLE patientdelivery(
          patientdelivery_uuid     uuid           NOT NULL,
          ambulance_uuid           uuid           NOT NULL,
          patient_uuid             uuid           NOT NULL,
          hospital_uuid            uuid           NOT NULL,
          deliverystatus           varchar(50)    NOT NULL,
          departuredatetime        timestamp,
          estimatedarrivaltime     timestamp,
          arrivaldatetime          timestamp,
          admissiondatetime        timestamp,
          recordcreatetimestamp    timestamp      NOT NULL,
          recordcreatesource       varchar(50)    NOT NULL,
          recordupdatetimestamp    timestamp      NOT NULL,
          recordupdatesource       varchar(50)    NOT NULL
      )
      ;
      -- 
      -- TABLE: ambulance 
      --
      ALTER TABLE ambulance ADD 
          CONSTRAINT ambulancepk PRIMARY KEY (ambulance_uuid)
      ;
      -- 
      -- TABLE: emergencymedicalservicecall 
      --
      ALTER TABLE emergencymedicalservicecall ADD 
          CONSTRAINT emergencymedicalservicecallpk PRIMARY KEY (emergencymedicalservicecall_uuid)
      ;
      -- 
      -- TABLE: emergencymedicalserviceprovider 
      --
      ALTER TABLE emergencymedicalserviceprovider ADD 
          CONSTRAINT emergencymedicalserviceproviderpk PRIMARY KEY (emergencymedicalserviceprovider_uuid)
      ;
      -- 
      -- TABLE: hospital 
      --
      ALTER TABLE hospital ADD 
          CONSTRAINT hospitalpk PRIMARY KEY (hospital_uuid)
      ;
      -- 
      -- TABLE: hospitaladministrator 
      --
      ALTER TABLE hospitaladministrator ADD 
          CONSTRAINT hospitaladministratorpk PRIMARY KEY (hospitaladministrator_uuid)
      ;
      -- 
      -- TABLE: hospitalstatusupdate 
      --
      ALTER TABLE hospitalstatusupdate ADD 
          CONSTRAINT hospitalstatusupdatepk PRIMARY KEY (hospitalstatusupdate_uuid)
      ;
      -- 
      -- TABLE: patient 
      --
      ALTER TABLE patient ADD 
          CONSTRAINT patientpk PRIMARY KEY (patient_uuid)
      ;
      -- 
      -- TABLE: patientdelivery 
      --
      ALTER TABLE patientdelivery ADD 
          CONSTRAINT patientdeliverypk PRIMARY KEY (patientdelivery_uuid)
      ;
      -- 
      -- TABLE: ambulance 
      --
      ALTER TABLE ambulance ADD 
          CONSTRAINT ambulanceuk UNIQUE (emergencymedicalserviceprovider_uuid, ambulanceidentifier)
      ;
      -- 
      -- TABLE: emergencymedicalservicecall 
      --
      ALTER TABLE emergencymedicalservicecall ADD 
          CONSTRAINT emergencymedicalservicecalluk UNIQUE (dispatchcallnumber)
      ;
      -- 
      -- TABLE: emergencymedicalserviceprovider 
      --
      ALTER TABLE emergencymedicalserviceprovider ADD 
          CONSTRAINT emergencymedicalserviceprovideruk UNIQUE (emergencymedicalserviceprovidername)
      ;
      -- 
      -- TABLE: hospital 
      --
      ALTER TABLE hospital ADD 
          CONSTRAINT hospitaluk UNIQUE (hospitalname)
      ;
      -- 
      -- TABLE: hospitaladministrator 
      --
      ALTER TABLE hospitaladministrator ADD 
          CONSTRAINT hospitaladministratoruk UNIQUE (hospital_uuid, hospitaladministratoridentifier)
      ;
      -- 
      -- TABLE: hospitalstatusupdate 
      --
      ALTER TABLE hospitalstatusupdate ADD 
          CONSTRAINT hospitalstatusupdateuk UNIQUE (hospital_uuid, updatedatetime)
      ;
      -- 
      -- TABLE: patient 
      --
      ALTER TABLE patient ADD 
          CONSTRAINT patientuk UNIQUE (patientnumber)
      ;
      -- 
      -- TABLE: patientdelivery 
      --
      ALTER TABLE patientdelivery ADD 
          CONSTRAINT patientdeliveryuk UNIQUE (ambulance_uuid, patient_uuid, hospital_uuid)
      ;
      -- 
      -- TABLE: ambulance 
      --
      ALTER TABLE ambulance ADD CONSTRAINT ambulanceemergencymedicalserviceproviderfk 
          FOREIGN KEY (emergencymedicalserviceprovider_uuid)
          REFERENCES emergencymedicalserviceprovider(emergencymedicalserviceprovider_uuid)
      ;
      -- 
      -- TABLE: hospitaladministrator 
      --
      ALTER TABLE hospitaladministrator ADD CONSTRAINT hospitaladministratorhospitalfk 
          FOREIGN KEY (hospital_uuid)
          REFERENCES hospital(hospital_uuid)
      ;
      -- 
      -- TABLE: hospitalstatusupdate 
      --
      ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdatehospitaladministratorfk 
          FOREIGN KEY (hospitaladministrator_uuid)
          REFERENCES hospitaladministrator(hospitaladministrator_uuid)
      ;
      ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdatehospitalfk 
          FOREIGN KEY (hospital_uuid)
          REFERENCES hospital(hospital_uuid)
      ;
      -- 
      -- TABLE: patient 
      --
      ALTER TABLE patient ADD CONSTRAINT patientemergencymedicalservicecallfk 
          FOREIGN KEY (emergencymedicalservicecall_uuid)
          REFERENCES emergencymedicalservicecall(emergencymedicalservicecall_uuid)
      ;
      -- 
      -- TABLE: patientdelivery 
      --
      ALTER TABLE patientdelivery ADD CONSTRAINT patientdeliveryambulancefk 
          FOREIGN KEY (ambulance_uuid)
          REFERENCES ambulance(ambulance_uuid)
      ;
      ALTER TABLE patientdelivery ADD CONSTRAINT patientdeliveryhospitalfk 
          FOREIGN KEY (hospital_uuid)
          REFERENCES hospital(hospital_uuid)
      ;
      ALTER TABLE patientdelivery ADD CONSTRAINT patientdeliverypatientfk 
          FOREIGN KEY (patient_uuid)
          REFERENCES patient(patient_uuid)
      ;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("patientdelivery");
    await queryInterface.dropTable("patient");
    await queryInterface.dropTable("hospitalstatusupdate");
    await queryInterface.dropTable("hospitaladministrator");
    await queryInterface.dropTable("hospital");
    await queryInterface.dropTable("ambulance");
    await queryInterface.dropTable("emergencymedicalservicecall");
    await queryInterface.dropTable("emergencymedicalserviceprovider");
  },
};

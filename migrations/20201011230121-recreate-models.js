module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`, { transaction });
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;', { transaction });
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;', { transaction });
      await queryInterface.sequelize.query(
        `
        --
        -- ER/Studio Data Architect SQL Code Generation
        -- Project :      BATS Logical Data Model.DM1
        --
        -- Date Created : Monday, September 28, 2020 14:56:16
        -- Target DBMS : PostgreSQL 9.x
        --
        -- Assumes prior execution of: 
        --   - CREATE EXTENSION pgcrypto;
        --   - CREATE EXTENSION citext;
        -- 
        -- TABLE: ambulance 
        --
        
        CREATE TABLE ambulance(
            ambulance_uuid           uuid           DEFAULT gen_random_uuid() NOT NULL,
            emsorganization_uuid     uuid,
            ambulanceidentifier      varchar(50)    NOT NULL,
            recordcreatetimestamp    timestamp      NOT NULL,
            recordcreateuser_uuid    uuid           NOT NULL,
            recordupdatetimestamp    timestamp      NOT NULL,
            recordupdateuser_uuid    uuid           NOT NULL,
            CONSTRAINT ambulance_pk PRIMARY KEY (ambulance_uuid),
            CONSTRAINT ambulance_uk  UNIQUE (emsorganization_uuid, ambulanceidentifier)
        )
        ;
        
        
        
        -- 
        -- TABLE: batsuser 
        --
        
        CREATE TABLE batsuser(
            user_uuid                      uuid            DEFAULT  gen_random_uuid() NOT NULL,
            organization_uuid              uuid            NOT NULL,
            email                          citext          NOT NULL,
            firstname                      varchar(50)     NOT NULL,
            lastname                       varchar(50)     NOT NULL,
            subjectid                      varchar(100),
            hashedpassword                 varchar(100),
            ssodata                        jsonb,
            operationaluserindicator       boolean         NOT NULL,
            administrativeuserindicator    boolean         NOT NULL,
            superuserindicator             boolean         NOT NULL,
            recordcreatetimestamp          timestamp       NOT NULL,
            recordcreateuser_uuid          uuid            NOT NULL,
            recordupdatetimestamp          timestamp       NOT NULL,
            recordupdateuser_uuid          uuid            NOT NULL,
            CONSTRAINT batsuser_pk PRIMARY KEY (user_uuid),
            CONSTRAINT batsuser_uk  UNIQUE (email)
        )
        ;
        
        
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        CREATE TABLE emergencymedicalservicecall(
            emergencymedicalservicecall_uuid    uuid         DEFAULT gen_random_uuid() NOT NULL,
            dispatchcallnumber                  int4         NOT NULL,
            startdatetime                       timestamp    NOT NULL,
            recordcreatetimestamp               timestamp    NOT NULL,
            recordcreateuser_uuid               uuid         NOT NULL,
            recordupdatetimestamp               timestamp    NOT NULL,
            recordupdateuser_uuid               uuid         NOT NULL,
            CONSTRAINT emergencymedicalservicecall_pk PRIMARY KEY (emergencymedicalservicecall_uuid),
            CONSTRAINT emergencymedicalservicecall_uk  UNIQUE (dispatchcallnumber)
        )
        ;
        
        
        
        -- 
        -- TABLE: hospital 
        --
        
        CREATE TABLE hospital(
            hospital_uuid                  uuid           DEFAULT gen_random_uuid() NOT NULL,
            healthcareorganization_uuid    uuid           NOT NULL,
            hospitalname                   varchar(60)    NOT NULL,
            recordcreatetimestamp          timestamp      NOT NULL,
            recordcreateuser_uuid          uuid           NOT NULL,
            recordupdatetimestamp          timestamp      NOT NULL,
            recordupdateuser_uuid          uuid           NOT NULL,
            CONSTRAINT hospital_pk PRIMARY KEY (hospital_uuid),
            CONSTRAINT hospital_uk  UNIQUE (hospitalname)
        )
        ;
        
        
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        CREATE TABLE hospitalstatusupdate(
            hospitalstatusupdate_uuid             uuid             DEFAULT gen_random_uuid() NOT NULL,
            hospital_uuid                         uuid             NOT NULL,
            updatedatetime                        timestamp        NOT NULL,
            edadminuser_uuid                      uuid             NOT NULL,
            openedbedcount                        int2,
            edwaitingroomcount                    int2,
            divertstatusindicator                 boolean          NOT NULL,
            additionalserviceavailabilitynotes    varchar(1000),
            recordcreatetimestamp                 timestamp        NOT NULL,
            recordcreateuser_uuid                 uuid             NOT NULL,
            recordupdatetimestamp                 timestamp        NOT NULL,
            recordupdateuser_uuid                 uuid             NOT NULL,
            CONSTRAINT hospitalstatusupdate_pk PRIMARY KEY (hospitalstatusupdate_uuid),
            CONSTRAINT hospitalstatusupdate_uk  UNIQUE (hospital_uuid, updatedatetime)
        )
        ;
        
        
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        CREATE TABLE hospitaluser(
            hospitaluser_uuid        uuid         DEFAULT gen_random_uuid() NOT NULL,
            hospital_uuid            uuid         NOT NULL,
            edadminuser_uuid         uuid         NOT NULL,
            recordcreatetimestamp    timestamp    NOT NULL,
            recordcreateuser_uuid    uuid         NOT NULL,
            recordupdatetimestamp    timestamp    NOT NULL,
            recordupdateuser_uuid    uuid         NOT NULL,
            CONSTRAINT hospitaluser_pk PRIMARY KEY (hospitaluser_uuid),
            CONSTRAINT hospitaluser_uk  UNIQUE (hospital_uuid, edadminuser_uuid)
        )
        ;
        
        
        
        -- 
        -- TABLE: organization 
        --
        
        CREATE TABLE organization(
            organization_uuid        uuid            DEFAULT gen_random_uuid() NOT NULL,
            organizationname         varchar(100)    NOT NULL,
            organizationtypename     varchar(50)     NOT NULL,
            recordcreatetimestamp    timestamp       NOT NULL,
            recordcreateuser_uuid    uuid            NOT NULL,
            recordupdatetimestamp    timestamp       NOT NULL,
            recordupdateuser_uuid    uuid            NOT NULL,
            CONSTRAINT organization_pk PRIMARY KEY (organization_uuid),
            CONSTRAINT organization_uk  UNIQUE (organizationname)
        )
        ;
        
        
        
        -- 
        -- TABLE: patient 
        --
        
        CREATE TABLE patient(
            patient_uuid                        uuid             DEFAULT gen_random_uuid() NOT NULL,
            emergencymedicalservicecall_uuid    uuid             NOT NULL,
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
            recordcreatetimestamp               timestamp        NOT NULL,
            recordcreateuser_uuid               uuid             NOT NULL,
            recordupdatetimestamp               timestamp        NOT NULL,
            recordupdateuser_uuid               uuid             NOT NULL,
            CONSTRAINT patient_pk PRIMARY KEY (patient_uuid),
            CONSTRAINT patient_uk  UNIQUE (patientnumber)
        )
        ;
        
        
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        CREATE TABLE patientdelivery(
            patientdelivery_uuid     uuid           DEFAULT gen_random_uuid() NOT NULL,
            ambulance_uuid           uuid           NOT NULL,
            patient_uuid             uuid           NOT NULL,
            hospital_uuid            uuid           NOT NULL,
            paramedicuser_uuid       uuid           NOT NULL,
            deliverystatus           varchar(50)    NOT NULL,
            departuredatetime        timestamp,
            estimatedarrivaltime     timestamp,
            arrivaldatetime          timestamp,
            admissiondatetime        timestamp,
            recordcreatetimestamp    timestamp      NOT NULL,
            recordcreateuser_uuid    uuid           NOT NULL,
            recordupdatetimestamp    timestamp      NOT NULL,
            recordupdateuser_uuid    uuid           NOT NULL,
            CONSTRAINT patientdelivery_pk PRIMARY KEY (patientdelivery_uuid),
            CONSTRAINT patientdelivery_uk  UNIQUE (ambulance_uuid, patient_uuid, hospital_uuid)
        )
        ;
        
        
        
        -- 
        -- TABLE: ambulance 
        --
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_organization_fk 
            FOREIGN KEY (emsorganization_uuid)
            REFERENCES organization(organization_uuid)
        ;
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: batsuser 
        --
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_organization_fk 
            FOREIGN KEY (organization_uuid)
            REFERENCES organization(organization_uuid)
        ;
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        ALTER TABLE emergencymedicalservicecall ADD CONSTRAINT emergencymedicalservicecall_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE emergencymedicalservicecall ADD CONSTRAINT emergencymedicalservicecall_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: hospital 
        --
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_organization_fk 
            FOREIGN KEY (healthcareorganization_uuid)
            REFERENCES organization(organization_uuid)
        ;
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_edadmin_batsuser_fk 
            FOREIGN KEY (edadminuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_edadmin_batsuser_fk 
            FOREIGN KEY (edadminuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: organization 
        --
        
        ALTER TABLE organization ADD CONSTRAINT organization_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE organization ADD CONSTRAINT organization_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: patient 
        --
        
        ALTER TABLE patient ADD CONSTRAINT patient_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patient ADD CONSTRAINT patient_emergencymedicalservicecall_fk 
            FOREIGN KEY (emergencymedicalservicecall_uuid)
            REFERENCES emergencymedicalservicecall(emergencymedicalservicecall_uuid)
        ;
        
        ALTER TABLE patient ADD CONSTRAINT patient_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_ambulance_fk 
            FOREIGN KEY (ambulance_uuid)
            REFERENCES ambulance(ambulance_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_create_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_paramedic_batsuser_fk 
            FOREIGN KEY (paramedicuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_patient_fk 
            FOREIGN KEY (patient_uuid)
            REFERENCES patient(patient_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_update_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
      `,
        { transaction }
      );
    });
  },

  down: async () => {},
};

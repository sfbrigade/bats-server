module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`, { transaction });
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;', { transaction });
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;', { transaction });
      await queryInterface.sequelize.query(
        `
        --
        -- ER/Studio Data Architect SQL Code Generation, plus some hacking by Bill Hoke for the latest change
        -- Project :      BATS Logical Data Model.DM1
        --
        -- Date Created : Wednesday, December 16, 2020 21:55:36
        -- Date Modified: Wednesday, May 19, 2021 ... 5 months ... not bad for a run of stability
        -- Target DBMS : PostgreSQL 10.x-12.x
        --
        -- Change in this version: Added emergencymedicalservicecallambulance to capture the association of an emergency medical 
        --                         service call ("incident") to an ambulance ("unit"), newly made available by a feed to be sent 
        --                         by SFFD. This will enable the user interface to intelligently constrain calls (incident numbers)
        --                         available for selection based on the established context of which unit is associated with the 
        --                         current user.
        
        -- Assumes prior execution of: 
        --   - CREATE EXTENSION pgcrypto;
        --   - CREATE EXTENSION citext;
        --
        
        -- 
        -- TABLE: ambulance 
        --
        
        CREATE TABLE ambulance(
            ambulance_uuid           uuid           DEFAULT gen_random_uuid() NOT NULL,
            emsorganization_uuid     uuid,
            ambulanceidentifier      varchar(50)    NOT NULL,
            activeindicator          boolean        DEFAULT TRUE NOT NULL,
            recordcreatetimestamp    timestamp      NOT NULL,
            recordcreateuser_uuid    uuid           NOT NULL,
            recordupdatetimestamp    timestamp      NOT NULL,
            recordupdateuser_uuid    uuid           NOT NULL
        )
        ;
        
        
        
        -- 
        -- TABLE: batsuser 
        --
        
        CREATE TABLE batsuser(
            user_uuid                      uuid            DEFAULT gen_random_uuid() NOT NULL,
            organization_uuid              uuid            NOT NULL,
            email                          varchar(100)    NOT NULL,
            firstname                      varchar(50)     NOT NULL,
            lastname                       varchar(50)     NOT NULL,
            subjectid                      varchar(100),
            hashedpassword                 varchar(100),
            ssodata                        json,
            twofactorauth                  boolean         DEFAULT FALSE NOT NULL,
            operationaluserindicator       boolean         NOT NULL,
            administrativeuserindicator    boolean         NOT NULL,
            superuserindicator             boolean         NOT NULL,
            activeindicator                boolean         DEFAULT TRUE NOT NULL,
            recordcreatetimestamp          timestamp       NOT NULL,
            recordcreateuser_uuid          uuid            NOT NULL,
            recordupdatetimestamp          timestamp       NOT NULL,
            recordupdateuser_uuid          uuid            NOT NULL
        )
        ;
        alter table batsuser alter column email type citext;
        alter table batsuser alter column ssodata type jsonb;
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        CREATE TABLE emergencymedicalservicecall(
            emergencymedicalservicecall_uuid    uuid                           DEFAULT gen_random_uuid() NOT NULL,
            dispatchcallnumber                  integer                        NOT NULL,
            startdatetimelocal                  timestamp without time zone    NOT NULL,
            recordcreatetimestamp               timestamp                      NOT NULL,
            recordcreateuser_uuid               uuid                           NOT NULL,
            recordupdatetimestamp               timestamp                      NOT NULL,
            recordupdateuser_uuid               uuid                           NOT NULL
        )
        ;
        
        
        
        --
        -- TABLE: emergencymedicalservicecallambulance
        --

        CREATE TABLE emergencymedicalservicecallambulance(
            emergencymedicalservicecallambulance_uuid   uuid DEFAULT gen_random_uuid() NOT NULL,
            emergencymedicalservicecall_uuid            uuid                           NOT NULL,
            ambulance_uuid                              uuid                           NOT NULL,
        --    Including the following, additional specificity to the startdatetimelocal that is also in emergencymedicalservicecall
        --    in case the associative data ever includes the addition of one or more units to a call after the initial unit is assigned,
        --    in which case the start time for the secondary unit(s) might (hopefully) be after the initial unit.
            startdatetimelocal                          timestamp without time zone    NOT NULL,
            recordcreatetimestamp                       timestamp                      NOT NULL,
            recordcreateuser_uuid                       uuid                           NOT NULL,
            recordupdatetimestamp                       timestamp                      NOT NULL,
            recordupdateuser_uuid                       uuid                           NOT NULL
        )
        ;



        -- 
        -- TABLE: hospital 
        --
        
        CREATE TABLE hospital(
            hospital_uuid                  uuid           DEFAULT gen_random_uuid() NOT NULL,
            healthcareorganization_uuid    uuid           NOT NULL,
            hospitalname                   varchar(60)    NOT NULL,
            sortsequencenumber             smallint,
            activeindicator                boolean        DEFAULT TRUE NOT NULL,
            recordcreatetimestamp          timestamp      NOT NULL,
            recordcreateuser_uuid          uuid           NOT NULL,
            recordupdatetimestamp          timestamp      NOT NULL,
            recordupdateuser_uuid          uuid           NOT NULL
        )
        ;
        
        
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        CREATE TABLE hospitalstatusupdate(
            hospitalstatusupdate_uuid             uuid                           DEFAULT gen_random_uuid() NOT NULL,
            hospital_uuid                         uuid                           NOT NULL,
            updatedatetimelocal                   timestamp without time zone    NOT NULL,
            edadminuser_uuid                      uuid                           NOT NULL,
            openedbedcount                        smallint                       NOT NULL,
            openpsychbedcount                     smallint                       NOT NULL,
            bedcountupdatedatetimelocal           timestamp without time zone    NULL,
            divertstatusindicator                 boolean                        NOT NULL,
            divertstatusupdatedatetimelocal       timestamp without time zone    NULL,
            additionalserviceavailabilitynotes    varchar(1000),
            notesupdatedatetimelocal              timestamp without time zone    NULL,
            recordcreatetimestamp                 timestamp                      NOT NULL,
            recordcreateuser_uuid                 uuid                           NOT NULL,
            recordupdatetimestamp                 timestamp                      NOT NULL,
            recordupdateuser_uuid                 uuid                           NOT NULL
        )
        ;
        
        
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        CREATE TABLE hospitaluser(
            hospitaluser_uuid        uuid         DEFAULT gen_random_uuid() NOT NULL,
            hospital_uuid            uuid         DEFAULT gen_random_uuid(),
            edadminuser_uuid         uuid         DEFAULT gen_random_uuid(),
            activeindicator          boolean      DEFAULT TRUE NOT NULL,
            recordcreatetimestamp    timestamp    NOT NULL,
            recordcreateuser_uuid    uuid         NOT NULL,
            recordupdatetimestamp    timestamp    NOT NULL,
            recordupdateuser_uuid    uuid         NOT NULL
        )
        ;
        
        
        
        -- 
        -- TABLE: organization 
        --
        
        CREATE TABLE organization(
            organization_uuid        uuid            DEFAULT gen_random_uuid() NOT NULL,
            organizationname         varchar(100)    NOT NULL,
            organizationtypeenum     varchar(50)     NOT NULL,
            timezoneisocode          character(3)    DEFAULT 'PST' NOT NULL,
            activeindicator          boolean         DEFAULT TRUE NOT NULL,
            recordcreatetimestamp    timestamp       NOT NULL,
            recordcreateuser_uuid    uuid            NOT NULL,
            recordupdatetimestamp    timestamp       NOT NULL,
            recordupdateuser_uuid    uuid            NOT NULL,
            twoFactorEnabled         boolean         DEFAULT FALSE NOT NULL
        )
        ;
        CREATE TYPE organizationtype AS ENUM ('EMS', 'HEALTHCARE', 'C4SF');
        alter table organization 
           alter column organizationtypeenum type organizationtype 
           using organizationtypeenum::organizationtype;
        
        -- 
        -- TABLE: patient 
        --
        
        CREATE TABLE patient(
            patient_uuid                        uuid             DEFAULT gen_random_uuid() NOT NULL,
            emergencymedicalservicecall_uuid    uuid             NOT NULL,
            emergencyserviceresponsetypeenum    varchar(18)      NOT NULL,
            age                                 smallint,
            sexenum                             varchar(10),
            stableindicator                     boolean,
            chiefcomplaintdescription           varchar(1000),
            heartratebpm                        smallint,
            temperature                         decimal(4, 1),
            systolicbloodpressure               smallint,
            diastolicbloodpressure              smallint,
            respiratoryrate                     smallint,
            oxygensaturation                    smallint,
            lowoxygenresponsetypeenum           varchar(18),
            supplementaloxygenamount            integer,
            ivindicator                         boolean,
            etohsuspectedindicator              boolean,
            drugssuspectedindicator             boolean,
            psychindicator                      boolean,
            combativebehaviorindicator          boolean,
            restraintindicator                  boolean,
            "covid-19suspectedindicator"        boolean,
            otherobservationnotes               varchar(1000),
            recordcreatetimestamp               timestamp        NOT NULL,
            recordcreateuser_uuid               uuid             NOT NULL,
            recordupdatetimestamp               timestamp        NOT NULL,
            recordupdateuser_uuid               uuid             NOT NULL
        )
        ;
        CREATE TYPE emergencyserviceresponsetype AS ENUM ('CODE 2', 'CODE 3');
        alter table patient 
           alter column emergencyserviceresponsetypeenum type emergencyserviceresponsetype 
           using emergencyserviceresponsetypeenum::emergencyserviceresponsetype;
        CREATE TYPE lowoxygenresponsetype AS ENUM ('ROOM AIR', 'SUPPLEMENTAL OXYGEN');
        alter table patient 
           alter column lowoxygenresponsetypeenum type lowoxygenresponsetype 
           using lowoxygenresponsetypeenum::lowoxygenresponsetype;
        CREATE TYPE sextype AS ENUM ('MALE', 'FEMALE', 'NON-BINARY');
        alter table patient 
           alter column sexenum type sextype 
           using sexenum::sextype;
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        CREATE TABLE patientdelivery(
            patientdelivery_uuid                  uuid                           DEFAULT gen_random_uuid() NOT NULL,
            ambulance_uuid                        uuid                           NOT NULL,
            patient_uuid                          uuid                           NOT NULL,
            hospital_uuid                         uuid                           NOT NULL,
            paramedicuser_uuid                    uuid                           NOT NULL,
            currentdeliverystatusenum             varchar(50)                    NOT NULL,
            currentdeliverystatusdatetimelocal    timestamp without time zone,
            etaminutes                            int2,
            recordcreatetimestamp                 timestamp                      NOT NULL,
            recordcreateuser_uuid                 uuid                           NOT NULL,
            recordupdatetimestamp                 timestamp                      NOT NULL,
            recordupdateuser_uuid                 uuid                           NOT NULL
        )
        ;
        CREATE TYPE deliverystatus AS ENUM ('RINGDOWN SENT', 'RINGDOWN RECEIVED', 'ARRIVED', 'OFFLOADED', 'RETURNED TO SERVICE', 'CANCELLED', 'CANCEL ACKNOWLEGED', 'REDIRECTED', 'REDIRECT ACKNOWLEGED');
        alter table patientdelivery 
           alter column currentdeliverystatusenum type deliverystatus 
           using currentdeliverystatusenum::deliverystatus;
        
        -- 
        -- TABLE: patientdeliveryupdate 
        --
        
        CREATE TABLE patientdeliveryupdate(
            patientdeliveryupdate_uuid     uuid                           DEFAULT gen_random_uuid() NOT NULL,
            patientdelivery_uuid           uuid                           DEFAULT gen_random_uuid() NOT NULL,
            deliverystatusdatetimelocal    timestamp without time zone    NOT NULL,
            deliverystatusenum             varchar(50)                    NOT NULL,
            recordcreatetimestamp          timestamp                      NOT NULL,
            recordcreateuser_uuid          uuid                           DEFAULT gen_random_uuid() NOT NULL,
            recordupdatetimestamp          timestamp                      NOT NULL,
            recordupdateuser_uuid          uuid                           DEFAULT gen_random_uuid() NOT NULL
        )
        ;
        alter table patientdeliveryupdate 
           alter column deliverystatusenum type deliverystatus 
           using deliverystatusenum::deliverystatus;
        
        -- 
        -- TABLE: ambulance 
        --
        
        ALTER TABLE ambulance ADD 
            CONSTRAINT ambulance_pk PRIMARY KEY (ambulance_uuid)
        ;
        
        -- 
        -- TABLE: batsuser 
        --
        
        ALTER TABLE batsuser ADD 
            CONSTRAINT batsuser_pk PRIMARY KEY (user_uuid)
        ;
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        ALTER TABLE emergencymedicalservicecall ADD 
            CONSTRAINT emergencymedicalservicecall_pk PRIMARY KEY (emergencymedicalservicecall_uuid)
        ;
        
        -- 
        -- TABLE: hospital 
        --
        
        ALTER TABLE hospital ADD 
            CONSTRAINT hospital_pk PRIMARY KEY (hospital_uuid)
        ;
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        ALTER TABLE hospitalstatusupdate ADD 
            CONSTRAINT hospitalstatusupdate_pk PRIMARY KEY (hospitalstatusupdate_uuid)
        ;
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        ALTER TABLE hospitaluser ADD 
            CONSTRAINT hospitaluser_pk PRIMARY KEY (hospitaluser_uuid)
        ;
        
        -- 
        -- TABLE: organization 
        --
        
        ALTER TABLE organization ADD 
            CONSTRAINT organization_pk PRIMARY KEY (organization_uuid)
        ;
        
        -- 
        -- TABLE: patient 
        --
        
        ALTER TABLE patient ADD 
            CONSTRAINT patient_pk PRIMARY KEY (patient_uuid)
        ;
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        ALTER TABLE patientdelivery ADD 
            CONSTRAINT patientdelivery_pk PRIMARY KEY (patientdelivery_uuid)
        ;
        
        -- 
        -- TABLE: patientdeliveryupdate 
        --
        
        ALTER TABLE patientdeliveryupdate ADD 
            CONSTRAINT patientdeliveryupdate_pk PRIMARY KEY (patientdeliveryupdate_uuid)
        ;
        
        -- 
        -- TABLE: ambulance 
        --
        
        ALTER TABLE ambulance ADD 
            CONSTRAINT ambulance_uk UNIQUE (emsorganization_uuid, ambulanceidentifier)
        ;
        
        -- 
        -- TABLE: batsuser 
        --
        
        ALTER TABLE batsuser ADD 
            CONSTRAINT batsuser_uk UNIQUE (email)
        ;
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        ALTER TABLE emergencymedicalservicecall ADD 
            CONSTRAINT emergencymedicalservicecall_uk UNIQUE (dispatchcallnumber)
        ;
        
        -- 
        -- TABLE: hospital 
        --
        
        ALTER TABLE hospital ADD 
            CONSTRAINT hospital_uk UNIQUE (hospitalname)
        ;
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        ALTER TABLE hospitalstatusupdate ADD 
            CONSTRAINT hospitalstatusupdate_uk UNIQUE (hospital_uuid, updatedatetimelocal)
        ;
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        ALTER TABLE hospitaluser ADD 
            CONSTRAINT hospitaluser_uk UNIQUE (hospital_uuid, edadminuser_uuid)
        ;
        
        -- 
        -- TABLE: organization 
        --
        
        ALTER TABLE organization ADD 
            CONSTRAINT organization_uk UNIQUE (organizationname)
        ;
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        ALTER TABLE patientdelivery ADD 
            CONSTRAINT patientdelivery_uk UNIQUE (ambulance_uuid, patient_uuid, hospital_uuid)
        ;
        
        -- 
        -- TABLE: patientdeliveryupdate 
        --
        
        ALTER TABLE patientdeliveryupdate ADD 
            CONSTRAINT patientdeliveryupdate_uk UNIQUE (patientdelivery_uuid, deliverystatusdatetimelocal)
        ;
        
        -- 
        -- TABLE: ambulance 
        --
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE ambulance ADD CONSTRAINT ambulance_organization_fk 
            FOREIGN KEY (emsorganization_uuid)
            REFERENCES organization(organization_uuid)
        ;
        
        
        -- 
        -- TABLE: batsuser 
        --
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
            DEFERRABLE INITIALLY DEFERRED
        ;
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_batsuser_recordupdate_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
            DEFERRABLE INITIALLY DEFERRED
        ;
        
        ALTER TABLE batsuser ADD CONSTRAINT batsuser_organization_fk 
            FOREIGN KEY (organization_uuid)
            REFERENCES organization(organization_uuid)
            DEFERRABLE INITIALLY DEFERRED
        ;
        
        
        -- 
        -- TABLE: emergencymedicalservicecall 
        --
        
        ALTER TABLE emergencymedicalservicecall ADD CONSTRAINT emergencymedicalservicecall_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE emergencymedicalservicecall ADD CONSTRAINT emergencymedicalservicecall_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        
        --
        -- TABLE: emergencymedicalservicecallambulance
        --

        ALTER TABLE emergencymedicalservicecallambulance ADD CONSTRAINT emergencymedicalservicecallambulance_emergencymedicalservicecall_fk 
            FOREIGN KEY (emergencymedicalservicecall_uuid)
            REFERENCES emergencymedicalservicecall(emergencymedicalservicecall_uuid)
        ;

        ALTER TABLE emergencymedicalservicecallambulance ADD CONSTRAINT emergencymedicalservicecallambulance_ambulance_fk 
            FOREIGN KEY (ambulance_uuid)
            REFERENCES ambulance(ambulance_uuid)
        ;

        ALTER TABLE emergencymedicalservicecallambulance ADD CONSTRAINT emergencymedicalservicecallambulance_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;

        ALTER TABLE emergencymedicalservicecallambulance ADD CONSTRAINT emergencymedicalservicecallambulance_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;


        -- 
        -- TABLE: hospital 
        --
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_batsuser_recordupdate_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospital ADD CONSTRAINT hospital_organization_fk 
            FOREIGN KEY (healthcareorganization_uuid)
            REFERENCES organization(organization_uuid)
        ;
        
        
        -- 
        -- TABLE: hospitalstatusupdate 
        --
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_batsuser_edmin_fk 
            FOREIGN KEY (edadminuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitalstatusupdate ADD CONSTRAINT hospitalstatusupdate_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        
        -- 
        -- TABLE: hospitaluser 
        --
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_batsuser_edadmin_fk 
            FOREIGN KEY (edadminuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE hospitaluser ADD CONSTRAINT hospitaluser_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        
        -- 
        -- TABLE: organization 
        --
        
        ALTER TABLE organization ADD CONSTRAINT organization_batsuser_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
            DEFERRABLE INITIALLY DEFERRED
        ;
        
        ALTER TABLE organization ADD CONSTRAINT organization_batsuser_recordupdate_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
            DEFERRABLE INITIALLY DEFERRED
        ;
        
        
        -- 
        -- TABLE: patient 
        --
        
        ALTER TABLE patient ADD CONSTRAINT patient_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patient ADD CONSTRAINT patient_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patient ADD CONSTRAINT patient_emergencymedicalservicecall_fk 
            FOREIGN KEY (emergencymedicalservicecall_uuid)
            REFERENCES emergencymedicalservicecall(emergencymedicalservicecall_uuid)
        ;
        
        
        -- 
        -- TABLE: patientdelivery 
        --
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_ambulance_fk 
            FOREIGN KEY (ambulance_uuid)
            REFERENCES ambulance(ambulance_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_batsuser_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_batsuser_paramedic_fk 
            FOREIGN KEY (paramedicuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_hospital_fk 
            FOREIGN KEY (hospital_uuid)
            REFERENCES hospital(hospital_uuid)
        ;
        
        ALTER TABLE patientdelivery ADD CONSTRAINT patientdelivery_patient_fk 
            FOREIGN KEY (patient_uuid)
            REFERENCES patient(patient_uuid)
        ;
        
        
        -- 
        -- TABLE: patientdeliveryupdate 
        --
        
        ALTER TABLE patientdeliveryupdate ADD CONSTRAINT patientdeliverystatus_batsuser_recordupdate_fk 
            FOREIGN KEY (recordupdateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        
        ALTER TABLE patientdeliveryupdate ADD CONSTRAINT patientdeliverystatus_patientdelivery_fk 
            FOREIGN KEY (patientdelivery_uuid)
            REFERENCES patientdelivery(patientdelivery_uuid)
        ;
        
        ALTER TABLE patientdeliveryupdate ADD CONSTRAINT patientdeliveryupdate_batsuser_recordcreate_fk 
            FOREIGN KEY (recordcreateuser_uuid)
            REFERENCES batsuser(user_uuid)
        ;
        `,
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`, { transaction });
    });
  },
};

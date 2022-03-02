module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        insert into organization (organizationname, organizationtypeenum, organizationstate, organizationstateuniqueid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'San Francisco Fire Department','EMS','06','S38-50827',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, organizationstate, organizationstateuniqueid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'King American','EMS','06','S3850502',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, organizationstate, organizationstateuniqueid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'American Medical Response (AMR)','EMS','06','S39-50088',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Kaiser Permanente','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Sutter Health CPMC','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'SF Dept. of Public Health','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Dignity Health','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Chinese Hospital','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'UCSF Health','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into organization (organizationname, organizationtypeenum, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Veterans Health Administration','HEALTHCARE',now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
      `,
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DELETE FROM organization WHERE organizationtypeenum<>'C4SF'`, { transaction });
    });
  },
};

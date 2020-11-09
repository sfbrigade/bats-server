module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Kaiser SF',(select organization_uuid from organization where organizationname='Kaiser Permanente' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'CPMC Davies',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'CPMC Van Ness',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Mission Bernal',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'SF General',(select organization_uuid from organization where organizationname='SF Dept. of Public Health' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'St. Francis',(select organization_uuid from organization where organizationname='Dignity Health' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'St. Mary''s',(select organization_uuid from organization where organizationname='Dignity Health' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Chinese Hospital',(select organization_uuid from organization where organizationname='Chinese Hospital' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'UCSF Parnassus',(select organization_uuid from organization where organizationname='UCSF Health' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, healthcareorganization_uuid, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'VA Med. Center',(select organization_uuid from organization where organizationname='Veterans Health Administration' and organizationtypeenum='HEALTHCARE'),now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        `,
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DELETE FROM hospital`, { transaction });
    });
  },
};

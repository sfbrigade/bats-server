module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Kaiser SF','06','20199',(select organization_uuid from organization where organizationname='Kaiser Permanente' and organizationtypeenum='HEALTHCARE'),7,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'CPMC Davies','06','20048',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),3,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'CPMC Van Ness','06','62636',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),4,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Mission Bernal','06','20050',(select organization_uuid from organization where organizationname='Sutter Health CPMC' and organizationtypeenum='HEALTHCARE'),2,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'SF General','06','20386',(select organization_uuid from organization where organizationname='SF Dept. of Public Health' and organizationtypeenum='HEALTHCARE'),1,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'St. Francis','06','20447',(select organization_uuid from organization where organizationname='Dignity Health' and organizationtypeenum='HEALTHCARE'),5,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'St. Mary''s','06','20462',(select organization_uuid from organization where organizationname='Dignity Health' and organizationtypeenum='HEALTHCARE'),8,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'Chinese Hospital','06','20065',(select organization_uuid from organization where organizationname='Chinese Hospital' and organizationtypeenum='HEALTHCARE'),6,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'UCSF Parnassus','06','20504',(select organization_uuid from organization where organizationname='UCSF Health' and organizationtypeenum='HEALTHCARE'),9,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospital (hospitalname, hospitalstate, hospitalstatefacilitycode, healthcareorganization_uuid, sortsequencenumber, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select 'VA Med. Center','06','20540',(select organization_uuid from organization where organizationname='Veterans Health Administration' and organizationtypeenum='HEALTHCARE'),10,now(),user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
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

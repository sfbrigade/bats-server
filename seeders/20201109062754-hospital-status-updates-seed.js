module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='Kaiser SF'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='CPMC Davies'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='CPMC Van Ness'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='Mission Bernal'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='SF General'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='St. Francis'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='St. Mary''s'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='Chinese Hospital'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='UCSF Parnassus'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        insert into hospitalstatusupdate (hospital_uuid, updatedatetimelocal, edadminuser_uuid, openedbedcount, openpsychbedcount, divertstatusindicator, recordcreatetimestamp, recordcreateuser_uuid, recordupdatetimestamp, recordupdateuser_uuid) select (select hospital_uuid from hospital where hospitalname='VA Med. Center'),now(),user_uuid, 0, 0, false, now(), user_uuid, now(), user_uuid from batsuser where email = 'batsadmin@c4sf.me';
        `,
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DELETE FROM hospitalstatusupdate`, { transaction });
    });
  },
};

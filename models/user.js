const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

const SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      id: {
        field: "user_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        field: "firstname",
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        field: "lastname",
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        field: "email",
        type: DataTypes.CITEXT,
      },
      subjectId: {
        field: "subjectid",
        type: DataTypes.STRING,
      },
      password: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
      },
      hashedPassword: {
        field: "hashedpassword",
        type: DataTypes.STRING,
      },
      ssoData: {
        field: "ssodata",
        type: DataTypes.JSONB,
      },
      isSuperUser: {
        field: "superuserindicator",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recordCreateTimestamp: {
        field: "recordcreatetimestamp",
        type: DataTypes.DATE,
      },
      recordUpdateTimestamp: {
        field: "recordupdatetimestamp",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "recordCreateTimestamp",
      updatedAt: "recordUpdateTimestamp",
      tableName: "batsuser",
      modelName: "User",
    }
  );
  User.beforeSave(async (user) => {
    /// if a new password has been set, hash for storage
    if (user.password) {
      user.hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });
  return User;
};

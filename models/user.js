"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      id: {
        field: "user_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
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
        type: DataTypes.STRING,
      },
      subjectId: {
        field: "subjectid",
        type: DataTypes.STRING,
      },
      password: {
        field: "hashedPassword",
        type: DataTypes.STRING,
      },
      ssoData: {
        field: "ssodata",
        type: DataTypes.JSONB,
      },
      roleName: {
        field: "rolename",
        type: DataTypes.STRING,
        allowNull: false,
      },
      isSuperUser: {
        field: "superuserindicator",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "batsuser",
      modelName: "User",
    }
  );
  return User;
};
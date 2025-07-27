const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nik: {
    type: DataTypes.STRING(16), 
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tempat_lahir: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_lahir: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  jenis_kelamin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  agama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rt: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rw: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
}, {
  freezeTableName: true,
  timestamps: false
});


module.exports = User;

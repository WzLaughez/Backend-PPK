const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Kegiatan = db.define("kegiatan", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Kegiatan;

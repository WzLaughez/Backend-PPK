const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Edukasi = db.define("tabel_edukasi", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, // karena boleh kosong awalnya
  },
});

module.exports = Edukasi;

const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Galeri = db.define("galeri", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING },
  tanggal_kegiatan: { type: DataTypes.DATEONLY }
});

module.exports = Galeri;

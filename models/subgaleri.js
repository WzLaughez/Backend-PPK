const { DataTypes } = require("sequelize");
const db = require("../config/db");
const Galeri = require("./galeri");

const Subgaleri = db.define("subgaleri", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  galeri_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING }
});

// Relasi
Galeri.hasMany(Subgaleri, { foreignKey: "galeri_id", as: "subgaleri" });
Subgaleri.belongsTo(Galeri, { foreignKey: "galeri_id", as: "galeri" });

module.exports = Subgaleri;

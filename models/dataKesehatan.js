const { DataTypes } = require("sequelize");
const db = require("../config/db");
const User = require("./user");

const DataKesehatan = db.define("data_kesehatan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_pemeriksaan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  // Pengganti BMI
  tinggi_badan: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  berat_badan: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  lingkar_lengan: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  lingkar_pinggang: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  status_bmi: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Gula Darah Terpisah
  gula_darah: {
  type: DataTypes.DECIMAL(5, 2),
  allowNull: true
  },
  tipe_gula_darah: {
    type: DataTypes.ENUM('puasa', '2_jam_pp', 'sewaktu'),
    allowNull: true
},
status_gula_darah: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  
// Tekanan Darah
  tekanan_sistolik: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tekanan_diastolik: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status_tekanan_darah: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

// Relasi
DataKesehatan.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(DataKesehatan, { foreignKey: "user_id" });

module.exports = DataKesehatan;

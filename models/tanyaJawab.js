const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TanyaJawab = sequelize.define("tanya_jawab", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  pertanyaan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  jawaban: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nama_penanya: {
    type: DataTypes.STRING,
    allowNull: true // Anonymous users
  },
  email_penanya: {
    type: DataTypes.STRING,
    allowNull: true // Anonymous users
  },
  answered_by: {
    type: DataTypes.INTEGER,
    allowNull: true // Admin who answered
  },
  yangMenjawab: {
    type: DataTypes.STRING,
    allowNull: true // Name of person who answered (input by admin)
  },
  answered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'answered', 'closed'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// Relationships will be defined in a separate associations file to avoid circular dependencies

module.exports = TanyaJawab;


const Admin = require('./Admin');
const TanyaJawab = require('./tanyaJawab');
const User = require('./user');

// Define associations
Admin.hasMany(TanyaJawab, { 
  foreignKey: 'answered_by', 
  as: 'tanyaJawab' 
});

TanyaJawab.belongsTo(Admin, { 
  foreignKey: 'answered_by', 
  as: 'admin',
  targetKey: 'id' 
});

module.exports = {
  Admin,
  TanyaJawab,
  User
};

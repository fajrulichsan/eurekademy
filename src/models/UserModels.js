const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import your Sequelize instance (sequelize)

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT, // Use BIGINT type for long integers
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Set the default value to true
  },
  verificationCode: {
    type : DataTypes.BIGINT,
    allowNull : false,
    defaultValue : 0000
  },
  verificationExpired : {
    type : DataTypes.DATE,
    allowNull : false,
  },
  role: {
    type : DataTypes.INTEGER,
    allowNull : false,
    defaultValue : 0
  }, 
});

// Add a hook to generate id from timestamp before creating a record

module.exports = User;

(async () => {
  try {
    await sequelize.sync();
    console.log('Table synchronization successful!');
  } catch (error) {
    console.error('Error synchronizing the table:', error);
  }
})();

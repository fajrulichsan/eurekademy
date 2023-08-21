const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database'); // Import your Sequelize instance (sequelize)

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID, // Use UUID type for unique identifiers
    defaultValue: DataTypes.UUIDV4, // Generate UUID using the v4 method
    primaryKey: true,
    allowNull: false,
  },
  name: {
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
  verification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  token: {                    //token verification
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  resetToken: {               //token reset password
    type: DataTypes.STRING,
  },
  resetTokenExpiration: {
    type: DataTypes.DATE,
  },
});

// Add a hook to generate ID and token before creating a record
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;


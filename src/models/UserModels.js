const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt")
const sequelize = require('../config/database'); // Import your Sequelize instance (sequelize)

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT, // Use BIGINT type for long integers
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
    defaultValue: false, // Set the default value to true
  },
});

// Add a hook to generate id from timestamp before creating a record
User.beforeCreate(async (user) => {
  user.id = new Date().getTime(); // Generate ID from current timestamp

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;

(async () => {
  try {
    await sequelize.sync();
    console.log('Table synchronization successful!');
  } catch (error) {
    console.error('Error synchronizing the table:', error);
  }
})();

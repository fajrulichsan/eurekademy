const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import your Sequelize instance (sequelize)

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    village: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


module.exports = Profile;

(async () => {
    try {
        // Add force: true to drop existing table and re-create
        await sequelize.sync({ force: false });
        console.log('Table synchronization successful!');
    } catch (error) {
        console.error('Error synchronizing the table:', error);
    }
})();

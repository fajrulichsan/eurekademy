const User = require("../../models/UserModels");
const sequelize = require("../../config/database")

exports.searchUserByEmailOrUsername = async (req, res) => {
    try {
        const search = req.params.search;

        const query = `
            SELECT * FROM eurekademy.users
            WHERE username LIKE :search OR email LIKE :search
        `;

        const [users, metadata] = await sequelize.query(query, {
            replacements: { search: `%${search}%` },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({userId : users.id , username : users.username, email : users.email});
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

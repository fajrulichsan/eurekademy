// import User from '../models/UserModels.js'
const sequelize = require("../config/database")
const User = require("../models/UserModels")

exports.getAllUser = async (req, res) => {
   try {
    const query = 'SELECT * FROM Users order by updatedAt desc '; 
    const [users, metadata] = await sequelize.query(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) =>{
    try{
        const query = 'SELECT * FROM Users WHERE id =' + req.params.id; 
        const [users, metadata] = await sequelize.query(query);
        res.status(200).json(users); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createUser = async (req, res) =>{
    try{
        req.body.id = new Date().getTime();
        await User.create(req.body)
        res.status(201).json({msg : 'Success create user'}); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.errors });
    }
}


exports.updateUser = async (req, res) =>{
    try{
        await User.update(req.body, {
            where : {
                id : req.params.id
            }
        })
        res.status(201).json({msg : 'Success update user'}); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteUser = async (req, res) =>{
    try{
        await User.destroy({
            where : {
                id : req.params.id
            }
        })
        res.status(201).json({msg : 'Success Delete user'}); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

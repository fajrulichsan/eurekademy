// import { Sequelize } from "sequelize";
const {Sequelize} = require("sequelize")

const sequelize = new Sequelize('eurekademy', 'root', 'root', {
    host : 'localhost',
    dialect : 'mysql'
})

module.exports = sequelize;
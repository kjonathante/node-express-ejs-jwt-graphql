require('dotenv').config();


var CONFIG = {}

CONFIG.dbHost      = process.env.DB_HOST
CONFIG.dbPort      = process.env.DB_PORT
CONFIG.dbName      = process.env.DB_NAME
CONFIG.dbUser      = process.env.DB_USER
CONFIG.dbPassword  = process.env.DB_PASSWORD

module.exports = CONFIG;


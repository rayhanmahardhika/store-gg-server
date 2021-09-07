// deklarasi config untuk ENV
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  serviceName: process.env.SERVICE_NAME,
  urlDB: process.env.MONGO_URL,
};

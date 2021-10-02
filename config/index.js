// deklarasi config untuk ENV
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  serviceName: process.env.SERVICE_NAME,
  jwtKey: process.env.SECRET,
  urlDB: process.env.MONGO_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectURI: process.env.REDIRECT_URI,
  refreshToken: process.env.REFRESH_TOKEN,
  folderID: process.env.FOLDER_ID,
};

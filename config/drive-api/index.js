const { google } = require("googleapis");
const config = require("../../config");
const fs = require("fs");

// instanstiate new oauth client
const oauthClient = new google.auth.OAuth2(
  config.clientID,
  config.clientSecret,
  config.redirectURI
);

oauthClient.setCredentials({ refresh_token: config.refreshToken });

const drive = google.drive({
  version: "v3",
  auth: oauthClient,
});

module.exports = {
  // post image to Drive 
  postImage: async (path, filename, ext) => {
    try {
      // create file
      const res = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: `image/${ext}`,
          parents: [config.folderID],
        },
        media: {
          mimeType: `image/${ext}`,
          body: fs.createReadStream(path),
        },
      });

      // change permission
      await drive.permissions.create({
        fileId: res.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      return res.data.id;
    } catch (err) {
      console.log(err.message);
    }
  },
  // delete image from drive
  deleteImage: async (fileId) => {
    try {
      const res = await drive.files.delete({
        fileId,
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};

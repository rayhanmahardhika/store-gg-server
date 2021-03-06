const Player = require("../player/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { postImage } = require("../../config/drive-api");

// API untuk auth
module.exports = {
  // API SignUp
  signUp: async (req, res, next) => {
    try {
      // menangkap semua request yang ada di body
      const payload = req.body;

      if (req.file) {
        let tmpPath = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        // let targetPath = path.resolve(
        //   config.rootPath,
        //   `public/uploads/${fileName}`
        // );

        // const src = fs.createReadStream(tmpPath);
        // const dest = fs.createWriteStream(targetPath);

        // menggunakan fungsi postImage ke drive
        const driveFileID = await postImage(tmpPath, fileName, originalExt);

        const player = new Player({ ...payload, avatar: driveFileID });

        await player.save();
        // menghapus password dari object player
        delete player._doc.password;

        res.status(201).json({ data: player });

        // src.pipe(dest);
        // src.on("end", async () => {
        //   try {
        //     const player = new Player({ ...payload, avatar: fileName });

        //     await player.save();
        //     // menghapus password dari object player
        //     delete player._doc.password;

        //     res.status(201).json({ data: player });
        //   } catch (err) {
        //     if (err && err.name === "ValidationError") {
        //       return res.status(422).json({
        //         error: 1,
        //         message: err.message,
        //         fields: err.errors,
        //       });
        //     }
        //     next(err);
        //   }
        // });
      } else {
        let player = new Player(payload);

        await player.save();
        // menghapus password dari object player
        delete player._doc.password;

        res.status(201).json({ data: player });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },
  // API SignIn
  // fungsi menggunakan then/promise (bukan async)
  signIn: (req, res, next) => {
    const { email, password } = req.body;

    Player.findOne({ email: email })
      .then((player) => {
        if (player) {
          const checkPassword = bcrypt.compareSync(password, player.password);
          if (checkPassword) {
            // auth menggunakan JWT
            const token = jwt.sign(
              {
                player: {
                  id: player._id,
                  username: player.username,
                  email: player.email,
                  name: player.name,
                  phoneNumber: player.phoneNumber,
                  avatar: player.avatar,
                },
              },
              config.jwtKey
            );
            // send the TOKEN content
            res.status(200).json({ data: { token } });
          } else {
            res.status(403).json({
              message: "Password incorrect",
            });
          }
        } else {
          res.status(403).json({
            message: "Email not registered",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || "Internal Server Error",
        });

        next();
      });
  },
};

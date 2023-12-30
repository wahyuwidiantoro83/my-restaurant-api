const multer = require("multer");
const fs = require("fs");

const uploader = (directory) => {
  //Lokasi penyimpanan
  const defaultDir = "./public";

  //Konfigurasi multer
  const storageUploader = multer.diskStorage({
    destination: (req, file, cb) => {
      const pathDir = directory ? defaultDir + directory : defaultDir;
      //Jika Existsync true maka parameter cb dari destination akan menyimpan file
      if (fs.existsSync(pathDir)) {
        console.log(`Directory ${defaultDir} EXIST`);
        cb(null, pathDir);
      } else {
        fs.mkdir(pathDir, (err) => {
          if (err) {
            console.log("error create directory", err);
          }
          return cb(err, pathDir);
        });
      }
    },
    filename: (req, file, cb) => {
      cb(
        null,
        "PIMG" +
          "-" +
          Date.now() +
          Math.round(Math.random() * 1000000000) +
          "." +
          file.mimetype.split("/")[1]
      );
    },
  });
  const fileFilter = (req, file, cb) => {
    console.log(file);
    if (
      file.originalname.toLowerCase().includes(".png") ||
      file.originalname.toLowerCase().includes(".jpg") ||
      file.originalname.toLowerCase().includes(".jpeg")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Your file extension denied, only png and jpg", false));
    }
  };
  return multer({ storage: storageUploader, fileFilter });
};

module.exports = { uploader };

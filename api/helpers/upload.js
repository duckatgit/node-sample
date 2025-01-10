const multer = require("multer");

const imageUpload = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
      const extension = file.originalname.split(".")[1];
      cb(null, `${Date.now()}.${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.includes("jpeg") ||
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("octet-stream")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  let upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload.single("image");
};

// upload documents
const docsUpload = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/documents/${folder}`);
    },
    filename: function (req, file, cb) {
      const extension = file.originalname;
      cb(null, `${Date.now()}.${extension}`);
    },
  });

  const upload = multer({ storage: storage });
  return upload.array("document");
};

module.exports = {
  docsUpload,
  imageUpload,
};

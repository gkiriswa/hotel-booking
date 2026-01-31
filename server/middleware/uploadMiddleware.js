/*import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  }
});

export default upload;*/

import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export const upload = multer({ storage })


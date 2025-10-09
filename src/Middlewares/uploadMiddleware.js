import multer from "multer"
import path from "path"
import fs from "fs"

const UPLOAD_DIR = path.join(process.cwd(), "contents");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// file name safe & unique
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

const allowedExt = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip", ".mp4"];
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
export const UPLOAD_DIR_PATH = UPLOAD_DIR;
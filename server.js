import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use('/uploads', express.static(uploadDir));

const PORT = 5001;

function respondWithLink(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file received' });
  res.json({ link: `http://localhost:${PORT}/uploads/${req.file.filename}` });
}

app.post('/upload_image', upload.single('file'), respondWithLink);
app.post('/upload_file', upload.single('file'), respondWithLink);

app.listen(PORT, () => console.log(`Upload server on http://localhost:${PORT}`));

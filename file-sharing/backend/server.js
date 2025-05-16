const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;
const uploadsDir = path.join(__dirname, 'uploads');
const metaPath = path.join(__dirname, 'fileMeta.json');

const corsOptions = {
  origin: ['http://localhost:3001', 'https://file-sharingwebapp.netlify.app/'], // Add your frontend URLs here
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
};

app.use(cors());
app.use(express.json());

// Ensure uploads/ exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Initialize metadata file
if (!fs.existsSync(metaPath)) fs.writeFileSync(metaPath, '{}');

// Helper: Read metadata
const readMeta = () => JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
const writeMeta = (data) => fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No file uploaded' });

  let password = req.body.password;
  let passwordHash = '';
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }
  const meta = readMeta();
  meta[req.file.filename] = {
    passwordHash,
    originalName: req.file.originalname
  };
  writeMeta(meta);

  res.send({ link: `https://experiment-with-ai.onrender.com/file/${req.file.filename}` });
});

// File info endpoint (to check if password is required)
app.get('/file/:filename/info', (req, res) => {
  const { filename } = req.params;
  const meta = readMeta();
  if (!meta[filename]) return res.status(404).send({ message: 'File not found' });
  res.send({
    passwordProtected: !!meta[filename].passwordHash,
    originalName: meta[filename].originalName
  });
});

// GET endpoint for accessing files directly (for images and non-protected files)
app.get('/file/:filename', (req, res) => {
  const { filename } = req.params;
  const meta = readMeta();
  
  // Check if file exists in metadata
  if (!meta[filename]) return res.status(404).send({ message: 'File not found' });
  
  // If file is password protected, don't allow direct access
  if (meta[filename].passwordHash) {
    return res.status(401).send({ message: 'This file is password protected. Please use the download endpoint.' });
  }
  
  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) return res.status(404).send({ message: 'File not found on disk' });
  
  // Send the file
  res.sendFile(filePath);
});

// Download endpoint (POST, checks password if needed, returns file)
app.post('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const { password } = req.body;
  const meta = readMeta();
  if (!meta[filename]) return res.status(404).send({ message: 'File not found' });

  if (meta[filename].passwordHash) {
    const match = await bcrypt.compare(password || '', meta[filename].passwordHash);
    if (!match) return res.status(401).send({ message: 'Incorrect password' });
  }

  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) return res.status(404).send({ message: 'File not found on disk' });
  res.download(filePath, meta[filename].originalName);
});

app.get('/', (req, res) => {
  res.send('File sharing server is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
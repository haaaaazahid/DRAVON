import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { adminAuth } from '../middleware/auth';

const r = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ok =
      /^(image\/(jpeg|jpg|png|webp|heic|heif)|video\/(mp4|quicktime|webm))$/.test(
        file.mimetype
      );

    if (ok) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported media type'));
    }
  },
});

r.post('/local', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'File required',
    });
  }

  res.json({
    message:
      'Local upload received. Configure Cloudinary/S3 for persistent production storage.',
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
});

r.get('/cloudinary-signature', adminAuth, (_req, res) => {
  const {
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
  } = process.env;

  if (
    !CLOUDINARY_API_SECRET ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_CLOUD_NAME
  ) {
    return res.status(503).json({
      message: 'Cloudinary is not configured',
    });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'dravon';

  const signature = crypto
    .createHash('sha1')
    .update(
      `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
    )
    .digest('hex');

  res.json({
    timestamp,
    folder,
    signature,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
  });
});

r.get('/accepted', (_req, res) =>
  res.json({
    images: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
    videos: ['mp4', 'mov', 'webm'],
    maxUploadMB: 100,
  })
);

export default r;
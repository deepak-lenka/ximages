require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
} else {
  console.log(`Uploads directory exists at: ${uploadsDir}`);
  // Check if directory is writable
  try {
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log('Uploads directory is writable');
  } catch (err) {
    console.error('Uploads directory is not writable:', err);
  }
}

// Serve static files from the uploads directory
app.use('/api/images', express.static(uploadsDir));
console.log(`Serving static files from: ${uploadsDir}`);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// xAI API configuration
const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_API_URL = process.env.XAI_API_URL || 'https://api.x.ai/v1/images/generations';

// Log API configuration
console.log('API Configuration:');
console.log('- API URL:', XAI_API_URL);
console.log('- API Key:', XAI_API_KEY ? 'Set' : 'Not set');

if (!XAI_API_KEY) {
  console.error('Warning: XAI_API_KEY is not set in environment variables');
}

// Helper function to save base64 image
const saveBase64Image = (base64Data, filename) => {
  const imgPath = path.join(uploadsDir, filename);
  // Check if the base64 data already has the data:image prefix
  const data = base64Data.includes('data:image') 
    ? base64Data.replace(/^data:image\/\w+;base64,/, '')
    : base64Data;
  fs.writeFileSync(imgPath, Buffer.from(data, 'base64'));
  return imgPath;
};

// Helper function to download image from URL
const downloadImage = async (url, filename) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imgPath = path.join(uploadsDir, filename);
    fs.writeFileSync(imgPath, Buffer.from(response.data));
    return imgPath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// API Routes
app.post('/api/generate', async (req, res) => {
  try {
    console.log('\n\n===== NEW IMAGE GENERATION REQUEST =====');
    const { prompt, n = 1 } = req.body;
    console.log(`Prompt: "${prompt}", Number of images: ${n}`);
    
    if (!prompt) {
      console.log('Error: Prompt is required');
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await axios.post(
      XAI_API_URL,
      {
        model: "grok-2-image-1212",
        prompt,
        n
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XAI_API_KEY}`
        }
      }
    );
    
    // Log the response structure
    console.log('\n===== API RESPONSE RECEIVED =====');
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers, null, 2));
    console.log('Response data structure:', JSON.stringify(response.data, null, 2));
    
    // Process and save images
    const images = [];
    if (response.data && response.data.data) {
      console.log('Number of images returned:', response.data.data.length);
      
      for (let i = 0; i < response.data.data.length; i++) {
        const item = response.data.data[i];
        console.log(`Image ${i} data:`, JSON.stringify(item, null, 2));
        
        const filename = `${Date.now()}-${i}.jpg`;
        let imgPath;
        
        try {
          // Check for different possible response formats
          if (item.b64_json) {
            console.log(`Image ${i} has b64_json data`);
            imgPath = saveBase64Image(item.b64_json, filename);
            console.log(`Saved base64 image to: ${imgPath}`);
            
            const imageId = `img_${Date.now()}_${i}`;
            const imageUrl = `/api/images/${filename}`;
            console.log(`Processing image ${i} - URL: ${imageUrl}`);
            images.push({
              id: imageId,
              filename,
              url: imageUrl,
              prompt
            });
            console.log(`Added image ${i} to response`);
          } else if (item.url) {
            console.log(`Image ${i} has URL: ${item.url}`);
            
            // Download the image from URL and save it locally
            imgPath = await downloadImage(item.url, filename);
            console.log(`Downloaded image from URL to: ${imgPath}`);
            
            const imageId = `img_${Date.now()}_${i}`;
            const imageUrl = `/api/images/${filename}`;
            console.log(`Processing image ${i} - URL: ${imageUrl}`);
            images.push({
              id: imageId,
              filename,
              url: imageUrl,
              prompt
            });
            console.log(`Added image ${i} to response`);
          } else if (typeof item === 'string' && item.startsWith('http')) {
            // Handle case where the item itself is a URL string
            console.log(`Image ${i} is a URL string: ${item}`);
            
            imgPath = await downloadImage(item, filename);
            console.log(`Downloaded image from URL string to: ${imgPath}`);
            
            const imageId = `img_${Date.now()}_${i}`;
            const imageUrl = `/api/images/${filename}`;
            console.log(`Processing image ${i} - URL: ${imageUrl}`);
            images.push({
              id: imageId,
              filename,
              url: imageUrl,
              prompt
            });
            console.log(`Added image ${i} to response`);
          } else if (typeof item === 'string' && (item.startsWith('/9j/') || item.includes('base64'))) {
            // Handle case where the item itself is a base64 string
            console.log(`Image ${i} is a base64 string`);
            
            imgPath = saveBase64Image(item, filename);
            console.log(`Saved base64 string to: ${imgPath}`);
            
            const imageId = `img_${Date.now()}_${i}`;
            const imageUrl = `/api/images/${filename}`;
            console.log(`Processing image ${i} - URL: ${imageUrl}`);
            images.push({
              id: imageId,
              filename,
              url: imageUrl,
              prompt
            });
            console.log(`Added image ${i} to response`);
          } else {
            console.log(`Image ${i} has no recognizable format:`, typeof item);
          }
        } catch (err) {
          console.error(`Error processing image ${i}:`, err);
        }
      }
    }
    
    console.log('\n===== FINAL RESPONSE =====');
    console.log('Number of images processed:', images.length);
    console.log('Images data:', JSON.stringify(images, null, 2));
    
    res.json({ success: true, images });
  } catch (error) {
    console.error('\n===== ERROR GENERATING IMAGES =====');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to generate images',
      details: error.response?.data || error.message
    });
  }
});

// Route to serve generated images
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imgPath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(imgPath)) {
    res.sendFile(imgPath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Endpoint to get all saved images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => ({
      id: `img_${file}`,
      filename: file,
      url: `/api/images/${file}`
    }));
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Image upload endpoint (for future use with image understanding)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  const imageUrl = `/api/images/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

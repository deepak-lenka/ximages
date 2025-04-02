import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Slider
} from '@mui/material';
import { generateImages } from '../services/api';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';

const HomePage = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageCount, setImageCount] = useState(1);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleImageCountChange = (e, newValue) => {
    setImageCount(newValue);
  };

  const handleGenerateImages = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setImages([]);

    try {
      console.log('Generating images with prompt:', prompt);
      const result = await generateImages(prompt, imageCount);
      console.log('API response:', result);
      
      if (result && result.images && result.images.length > 0) {
        console.log('Images received:', result.images.length);
        // Add the full backend URL to the image URLs
        const processedImages = result.images.map(img => ({
          ...img,
          displayUrl: `http://localhost:3001${img.url}`,
          url: `http://localhost:3001${img.url}`,
          prompt: prompt
        }));
        console.log('Processed images with full URLs:', processedImages);
        console.log('Processed images:', processedImages);
        setImages(processedImages);
      } else {
        console.warn('No images received in the response');
        setError('No images were generated. Please try again with a different prompt.');
      }
    } catch (err) {
      console.error('Error generating images:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate images');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (image) => {
    if (!image || !image.url) {
      setError('Image URL not available for download');
      return;
    }
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.id || 'grok-image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)' 
              : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 700,
            mb: 3
          }}
        >
          Generate Images with Grok AI
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          paragraph 
          align="center"
          sx={{ mb: 4 }}
        >
          Enter a detailed prompt to create AI-generated images using xAI's Grok model
        </Typography>

        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Enter your prompt"
            variant="outlined"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="A serene landscape with mountains and a lake at sunset..."
            multiline
            rows={3}
            margin="normal"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Number of Images: {imageCount}
              </Typography>
              <Slider
                value={imageCount}
                onChange={handleImageCountChange}
                aria-labelledby="image-count-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={4}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateImages}
              disabled={loading || !prompt.trim()}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <ImageIcon />}
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: 2
              }}
            >
              {loading ? 'Generating...' : 'Generate Images'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {images.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Generated Images
          </Typography>
          <Grid container spacing={3} className="image-grid">
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={image.id || index}>
                <Card className="image-card fade-in">
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                    <CardMedia
                      component="img"
                      image={image.displayUrl}
                      alt={`Generated image ${index + 1}`}
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        bgcolor: '#1e1e1e'
                      }}
                      onError={(e) => {
                        console.error(`Error loading image ${index}:`, image.displayUrl);
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="288" height="225" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 225" preserveAspectRatio="none"%3E%3Crect width="288" height="225" fill="%231e1e1e"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="16" fill="%23fff" text-anchor="middle" dy=".3em"%3EImage loading failed%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {image.prompt || prompt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Image ID: {image.id || `img_${index}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      URL: {image.url ? image.url.substring(0, 30) + '...' : 'N/A'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(image)}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;

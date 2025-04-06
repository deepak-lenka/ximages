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
        // Use relative URLs for image paths to avoid hardcoding the backend port
        const processedImages = result.images.map(img => ({
          ...img,
          displayUrl: img.url, // Use relative URL
          url: img.url, // Use relative URL
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

  const handleDownload = async (image) => {
    if (!image || !(image.displayUrl || image.url)) {
      setError('Image URL not available for download');
      return;
    }
    
    try {
      // Show loading state
      setLoading(true);
      
      // Make sure we have the full URL for downloading
      const imageUrl = image.displayUrl || image.url;
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
      console.log('Downloading image from URL:', fullUrl);
      
      // Fetch the image as a blob
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      // Convert the response to a blob
      const blob = await response.blob();
      
      // Create a blob URL for the image
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Set the href to the blob URL
      link.href = blobUrl;
      
      // Force download by setting the download attribute
      link.download = `${image.id || 'grok-image'}.jpg`;
      
      // Hide the link
      link.style.display = 'none';
      
      // Append to the DOM
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl); // Free up memory
      }, 100);
      
      console.log('Download completed successfully');
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          mb: 5, 
          borderRadius: '24px',
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)' 
              : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
          }
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 800,
            mb: 3,
            fontSize: { xs: '2rem', md: '2.5rem' },
            background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          Generate Images with Grok AI
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          paragraph 
          align="center"
          sx={{ 
            mb: 5, 
            maxWidth: '800px', 
            mx: 'auto',
            fontWeight: 400,
            fontSize: '1.1rem',
            lineHeight: 1.5
          }}
        >
          Enter a detailed prompt to create AI-generated images using xAI's Grok model
        </Typography>

        <Box component="form" noValidate sx={{ mt: 4, maxWidth: '800px', mx: 'auto' }}>
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
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7C3AED',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4F46E5',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
                '&.Mui-focused': {
                  color: '#4F46E5',
                },
              },
            }}
          />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Typography 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1.1rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Number of Images</span>
                <span style={{ 
                  background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>{imageCount}</span>
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
                sx={{
                  color: '#7C3AED',
                  height: 8,
                  '& .MuiSlider-track': {
                    border: 'none',
                    background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  },
                  '& .MuiSlider-thumb': {
                    height: 24,
                    width: 24,
                    backgroundColor: '#fff',
                    border: '2px solid #7C3AED',
                    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(124, 58, 237, 0.16)',
                    },
                  },
                  '& .MuiSlider-valueLabel': {
                    background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  },
                  '& .MuiSlider-mark': {
                    backgroundColor: '#bfbfbf',
                    height: 8,
                    width: 8,
                    borderRadius: '50%',
                  },
                  '& .MuiSlider-markActive': {
                    backgroundColor: '#7C3AED',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateImages}
              disabled={loading || !prompt.trim()}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <ImageIcon />}
              sx={{ 
                py: 1.5, 
                px: 5,
                borderRadius: '30px',
                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4338CA 0%, #6D28D9 100%)',
                  boxShadow: '0 15px 25px rgba(124, 58, 237, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: '#9CA3AF',
                  boxShadow: 'none',
                }
              }}
            >
              {loading ? 'Generating...' : 'Generate Images'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {images.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Generated Images
          </Typography>
<<<<<<< HEAD
          <Grid container spacing={4} className="image-grid">
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={image.id || index}>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                  }}
                  className="image-card fade-in"
                >
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      paddingTop: '100%',
                      overflow: 'hidden',
                    }}
                  >
=======
          <Grid container spacing={2} className="image-grid">
            {images.map((image, index) => {
              // Dynamically set grid size based on number of images
              let gridSize;
              if (images.length === 1) {
                gridSize = { xs: 12, sm: 12, md: 12 }; // Full width for single image
              } else if (images.length === 2) {
                gridSize = { xs: 12, sm: 6, md: 6 }; // Two images per row
              } else if (images.length === 3) {
                gridSize = { xs: 12, sm: 6, md: 4 }; // Three images per row
              } else {
                gridSize = { xs: 12, sm: 6, md: 3 }; // Four images per row (default)
              }
              
              return (
                <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} key={image.id || index}>
                <Card className="image-card fade-in">
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
>>>>>>> de24ec7c188e3b402c9832ef79cd5d9849c4c328
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
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                      onError={(e) => {
                        console.error(`Error loading image ${index}:`, image.displayUrl);
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="288" height="225" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 225" preserveAspectRatio="none"%3E%3Crect width="288" height="225" fill="%231e1e1e"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="16" fill="%23fff" text-anchor="middle" dy=".3em"%3EImage loading failed%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </Box>
<<<<<<< HEAD
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      p: 2,
                      mt: 'auto'
                    }}
                  >
=======
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {image.prompt || prompt}
                    </Typography>
                  </CardContent>
                  <CardActions>
>>>>>>> de24ec7c188e3b402c9832ef79cd5d9849c4c328
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(image)}
                      sx={{
                        borderRadius: '30px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #4338CA 0%, #6D28D9 100%)',
                          boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
            })}
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

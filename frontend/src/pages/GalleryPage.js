import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardActions, 
  Button, 
  Box,
  Snackbar,
  Alert,
  Skeleton,
  Backdrop,
  Modal,
  Fade
} from '@mui/material';
import { getImages } from '../services/api';
import DownloadIcon from '@mui/icons-material/Download';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const result = await getImages();
      
      // Process the images to ensure URLs are properly formatted
      const processedImages = (result.images || []).map(img => ({
        ...img,
        url: img.url // Use relative URL path
      }));
      
      console.log('Gallery images loaded:', processedImages.length);
      setImages(processedImages);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, index) => {
    try {
      // Make sure we have the full URL for downloading
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      console.log('Downloading image from URL:', fullUrl);
      
      // Fetch the image as a blob
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `grok-image-${index}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      setError(`Failed to download image: ${error.message}`);
    }
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 0 }}
        >
          Image Gallery
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchImages}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Gallery'}
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Skeleton 
                  variant="rectangular" 
                  height={250} 
                  animation="wave" 
                />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : images.length > 0 ? (
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
              <Card className="image-card">
                <CardMedia
                  component="img"
                  image={image.url}
                  alt={`Image ${index + 1}`}
                  sx={{ 
                    height: 0,
                    paddingTop: '100%', // 1:1 aspect ratio
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenModal(image)}
                />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(image.url, index)}
                  >
                    Download
                  </Button>
                  <Button
                    size="small"
                    startIcon={<FullscreenIcon />}
                    onClick={() => handleOpenModal(image)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
          })}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}
        >
          <Typography variant="h6" color="text.secondary" align="center">
            No images found in the gallery
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Generate some images on the home page to see them here
          </Typography>
        </Box>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
            borderRadius: 2,
            outline: 'none',
          }}>
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt="Full size"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GalleryPage;

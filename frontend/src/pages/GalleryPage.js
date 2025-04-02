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
      setImages(result.images || []);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, index) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `grok-image-${index}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Image Gallery
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
        <Grid container spacing={3} className="image-grid">
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={image.id || index}>
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
          ))}
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

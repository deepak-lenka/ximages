import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Modal,
  Box,
  Backdrop,
  Fade
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const ImageCard = ({ image, prompt, index }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `grok-image-${index}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="image-card">
        <CardMedia
          component="img"
          image={image.url}
          alt={`Generated image ${index + 1}`}
          sx={{ 
            height: 0,
            paddingTop: '100%', // 1:1 aspect ratio
            cursor: 'pointer',
            objectFit: 'cover'
          }}
          onClick={handleOpenModal}
        />
        {prompt && (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {prompt.length > 100 ? prompt.substring(0, 100) + '...' : prompt}
            </Typography>
          </CardContent>
        )}
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            size="small"
            startIcon={<FullscreenIcon />}
            onClick={handleOpenModal}
          >
            View
          </Button>
        </CardActions>
      </Card>

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
            <img
              src={image.url}
              alt="Full size"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ImageCard;

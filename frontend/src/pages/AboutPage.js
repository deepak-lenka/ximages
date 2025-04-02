import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';

const AboutPage = () => {
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
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          About XImage
        </Typography>
        
        <Typography variant="body1" paragraph>
          XImage is a modern web application that leverages the powerful Grok image generation API 
          from xAI to create high-quality, AI-generated images from text prompts. This application 
          demonstrates the capabilities of the Grok-2-image-1212 model, which can generate detailed 
          and creative images based on textual descriptions.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Features
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BrushIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h6">High-Quality Image Generation</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Generate detailed and creative images from text prompts using xAI's 
                  state-of-the-art Grok-2-image-1212 model.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoAwesomeIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h6">Customizable Options</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Control the number of images generated and select from different image sizes 
                  to suit your needs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpeedIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h6">Fast Processing</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Optimized backend processing ensures quick image generation and delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h6">Secure API Integration</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Secure handling of API keys and requests with proper error handling and rate limiting.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          About the Grok Image Generation API
        </Typography>
        
        <Typography variant="body1" paragraph>
          The Grok-2-image-1212 model from xAI is a powerful image generation model capable of 
          creating detailed and creative images from text prompts. It's part of the xAI suite 
          of AI models designed to push the boundaries of artificial intelligence.
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <ImageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="High-Resolution Images" 
              secondary="Generate images up to 1024x1024 resolution with detailed textures and compositions."
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CodeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Simple API Integration" 
              secondary="Easy to integrate with applications using RESTful API endpoints."
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Technical Stack
          </Typography>
          <Typography variant="body2" component="div">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <strong>Frontend:</strong>
                <ul>
                  <li>React.js</li>
                  <li>Material-UI</li>
                  <li>Axios</li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Backend:</strong>
                <ul>
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>xAI Grok API</li>
                </ul>
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;

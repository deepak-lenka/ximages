import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  useMediaQuery, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ mb: 2 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              color: theme.palette.primary.main,
              mr: 0.5
            }}
          >
            X
          </Box>
          Image
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="toggle theme"
              onClick={toggleTheme}
              sx={{ mr: 1 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem 
                onClick={handleMenuClose} 
                component={RouterLink} 
                to="/"
              >
                Home
              </MenuItem>
              <MenuItem 
                onClick={handleMenuClose} 
                component={RouterLink} 
                to="/gallery"
              >
                Gallery
              </MenuItem>
              <MenuItem 
                onClick={handleMenuClose} 
                component={RouterLink} 
                to="/about"
              >
                About
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/gallery"
              sx={{ mx: 1 }}
            >
              Gallery
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
              sx={{ mx: 1 }}
            >
              About
            </Button>
            <IconButton
              color="inherit"
              aria-label="toggle theme"
              onClick={toggleTheme}
              sx={{ ml: 1 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

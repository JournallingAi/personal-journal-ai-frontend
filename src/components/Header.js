import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book, Insights, Analytics, Person, Menu } from '@mui/icons-material';
import { useSidebar } from '../context/SidebarContext';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { toggleSidebar } = useSidebar();
  const API_BASE_URL = 'http://localhost:5001/api';

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // seed from cache so title updates immediately
    const cached = localStorage.getItem('user');
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch {}
    }

    fetchUserProfile();

    // Refresh title when profile is updated elsewhere
    const onProfileUpdated = () => fetchUserProfile();
    window.addEventListener('profile-updated', onProfileUpdated);
    return () => window.removeEventListener('profile-updated', onProfileUpdated);
  }, []);

  const navItems = [
    { label: 'Journal', path: '/', icon: <Book /> },
    { label: 'Insights', path: '/insights', icon: <Insights /> },
    { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
  ];

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        {/* Profile Menu Icon */}
        <IconButton 
          onClick={toggleSidebar}
          sx={{ 
            mr: 2,
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          <Menu />
        </IconButton>

        {/* Dynamic Title */}
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1, 
            color: 'primary.main', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Person sx={{ fontSize: 28 }} />
          {(() => {
            console.log('Header user object:', user);
            return user?.name ? `${user.name.split(' ')[0]}'s Journal` : 'Your Journal';
          })()}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                backgroundColor: location.pathname === item.path ? 'primary.50' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? 'primary.100' : 'grey.100',
                },
                borderRadius: 2,
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
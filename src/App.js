import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Journal from './components/Journal';
import Insights from './components/Insights';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { SidebarProvider } from './context/SidebarContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B73FF',
    },
    secondary: {
      main: '#FF6B9D',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              📝 AI Journal
            </Typography>
            <CircularProgress color="inherit" />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleOAuthProvider clientId="123456789-abcdefghijklmnop.apps.googleusercontent.com">
          <Login onLogin={handleLogin} />
        </GoogleOAuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Header user={user} onLogout={handleLogout} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<Journal />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Logout,
  Delete,
  Person,
  Email,
  Phone,
  Cake,
  LocationOn,
  Work,
  School
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    occupation: '',
    education: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders()
      });
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth || '',
        location: response.data.location || '',
        occupation: response.data.occupation || '',
        education: response.data.education || '',
        bio: response.data.bio || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      location: user.location || '',
      occupation: user.occupation || '',
      education: user.education || '',
      bio: user.bio || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await axios.put(`${API_BASE_URL}/auth/profile`, formData, {
        headers: getAuthHeaders()
      });

      setUser(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`${API_BASE_URL}/auth/account`, {
        headers: getAuthHeaders()
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          👤 Profile
        </Typography>
        {!isEditing && (
          <IconButton onClick={handleEdit} color="primary">
            <Edit />
          </IconButton>
        )}
      </Box>

      {/* Profile Picture */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
      </Box>

      {/* Error/Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Profile Form */}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        {isEditing ? (
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              fullWidth
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<Cancel />}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleLogout}
              startIcon={<Logout />}
              fullWidth
            >
              Logout
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
              startIcon={<Delete />}
              fullWidth
            >
              Delete Account
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Profile; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Analytics as AnalyticsIcon, Psychology, CalendarToday } from '@mui/icons-material';

const API_BASE_URL = 'https://personal-journal-ai-production.up.railway.app/api';

const Analytics = () => {
  const [moodData, setMoodData] = useState({});
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [moodResponse, entriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/mood`, { headers }),
        fetch(`${API_BASE_URL}/entries`, { headers })
      ]);
      
      if (!moodResponse.ok || !entriesResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const moodData = await moodResponse.json();
      const entriesData = await entriesResponse.json();
      
      setMoodData(moodData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError('Failed to fetch analytics. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      '😊 Happy': '#4CAF50',
      '😔 Sad': '#2196F3',
      '😤 Angry': '#F44336',
      '😰 Anxious': '#FF9800',
      '😴 Tired': '#9E9E9E',
      '🤔 Contemplative': '#673AB7',
      '😌 Peaceful': '#4CAF50',
      '😤 Frustrated': '#FF5722',
    };
    return moodColors[mood] || '#757575';
  };

  const calculateStats = () => {
    const totalEntries = entries.length;
    const entriesWithInsights = entries.filter(entry => entry.aiInsight).length;
    const uniqueTags = new Set(entries.flatMap(entry => entry.tags || [])).size;
    
    // Calculate most common mood
    const moodCounts = Object.entries(moodData);
    const mostCommonMood = moodCounts.length > 0 
      ? moodCounts.reduce((a, b) => moodData[a[0]] > moodData[b[0]] ? a : b)[0]
      : null;

    // Calculate average entries per day (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentEntries = entries.filter(entry => new Date(entry.timestamp) > lastWeek);
    const avgPerDay = recentEntries.length / 7;

    return {
      totalEntries,
      entriesWithInsights,
      uniqueTags,
      mostCommonMood,
      avgPerDay: Math.round(avgPerDay * 10) / 10,
      recentEntries: recentEntries.length
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = calculateStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AnalyticsIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Your Journal Analytics
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Key Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.totalEntries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" gutterBottom>
                {stats.entriesWithInsights}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI Insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.uniqueTags}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Tags
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" gutterBottom>
                {stats.avgPerDay}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg/Day (7 days)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mood Analytics */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 1 }} />
          Mood Distribution
        </Typography>
        
        {Object.keys(moodData).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No mood data available yet. Start journaling to see your mood patterns!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {Object.entries(moodData).map(([mood, count]) => (
              <Grid item xs={12} sm={6} md={4} key={mood}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={mood} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getMoodColor(mood),
                        color: 'white',
                        mr: 2
                      }}
                    />
                    <Typography variant="body2">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    {Math.round((count / stats.totalEntries) * 100)}%
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Recent Activity */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1 }} />
          Recent Activity (Last 7 Days)
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" color="primary">
            {stats.recentEntries}
          </Typography>
          <Box>
            <Typography variant="body1">
              entries in the last week
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.avgPerDay} entries per day on average
            </Typography>
          </Box>
        </Box>

        {stats.mostCommonMood && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Most Common Mood:</strong>
            </Typography>
            <Chip 
              label={stats.mostCommonMood} 
              sx={{ 
                backgroundColor: getMoodColor(stats.mostCommonMood),
                color: 'white'
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Analytics;

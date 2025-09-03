import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { 
  Psychology, 
  TrendingUp, 
  Lightbulb, 
  Star,
  Favorite,
  EmojiEmotions,
  AutoAwesome
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Emoji mapping for different moods and insights
const moodEmojis = {
  'happy': '😊',
  'sad': '😢',
  'excited': '🤩',
  'anxious': '😰',
  'calm': '😌',
  'frustrated': '😤',
  'grateful': '🙏',
  'confident': '💪',
  'tired': '😴',
  'energetic': '⚡',
  'default': '✨'
};

const insightEmojis = [
  '💡', '🌟', '🎯', '🚀', '💎', '🌈', '🎨', '🎭', '🎪', '🎡',
  '🔮', '⭐', '💫', '🌙', '☀️', '🌺', '🌸', '🌻', '🌹', '🌷'
];

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insights`);
      setInsights(response.data);
    } catch (error) {
      setError('Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRandomInsightEmoji = () => {
    return insightEmojis[Math.floor(Math.random() * insightEmojis.length)];
  };

  const getMoodEmoji = (mood) => {
    return moodEmojis[mood.toLowerCase()] || moodEmojis.default;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          ✨ Loading your magical insights... ✨
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 3 }}>
      <Box>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            p: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              mr: 3
            }}>
              <AutoAwesome sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                🎭 AI Insights & Coaching 🎭
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                Your personal growth journey with AI wisdom ✨
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {insights.length === 0 ? (
            <Paper elevation={0} sx={{ 
              p: 8, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Box sx={{ fontSize: 80, mb: 3 }}>🌟</Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}>
                No insights yet! 🎪
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 300 }}>
                Start your magical journaling journey! ✨
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300 }}>
                Write your thoughts and get personalized AI coaching advice to unlock amazing insights! 🚀
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {insights.map((entry, index) => (
                <Grid item xs={12} key={entry.id}>
                  <Card elevation={0} sx={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      border: '2px solid rgba(255, 255, 255, 0.4)'
                    }
                  }}>
                      <CardContent sx={{ p: 4 }}>
                        {/* Header with date and mood */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.main',
                              mr: 2
                            }}>
                              📅 {formatDate(entry.timestamp)}
                            </Typography>
                          </Box>
                          <Chip 
                            icon={<EmojiEmotions />}
                            label={`${getMoodEmoji(entry.mood)} ${entry.mood}`}
                            size="medium" 
                            sx={{ 
                              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              px: 2,
                              py: 1
                            }}
                          />
                        </Box>

                        {/* Journal Entry */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            📝 Your Journal Entry
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}>
                            "{entry.content}"
                          </Typography>
                        </Box>

                        {/* Tags */}
                        {entry.tags.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 'bold',
                              color: 'text.primary',
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              🏷️ Tags
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {entry.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="medium"
                                  sx={{ 
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                        
                        {/* AI Coaching Insight */}
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          p: 4, 
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            fontSize: 60,
                            opacity: 0.1
                          }}>
                            {getRandomInsightEmoji()}
                          </Box>
                          
                          <Typography variant="h5" sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <AutoAwesome sx={{ mr: 2, fontSize: 30 }} />
                            ✨ AI Coaching Insight ✨
                          </Typography>
                          
                          <Typography variant="body1" sx={{ 
                            whiteSpace: 'pre-wrap',
                            color: 'white',
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                            fontWeight: 300,
                            position: 'relative',
                            zIndex: 1
                          }}>
                            {entry.aiInsight}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <Favorite sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Growth Journey Summary */}
          {insights.length > 0 && (
            <Paper elevation={0} sx={{ 
              p: 4, 
              mt: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    width: 50, 
                    height: 50, 
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    mr: 2
                  }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    🚀 Your Growth Journey
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    Progress Overview 📊
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((insights.length / 10) * 100, 100)} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        borderRadius: 6
                      }
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {insights.length} insights collected • {Math.round((insights.length / 10) * 100)}% journey complete
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 300
                }}>
                  🎉 Amazing! You've received <strong>{insights.length} AI coaching insights</strong>. 
                  Keep journaling regularly to discover more patterns and receive personalized guidance for your incredible personal growth journey! 🌟
                </Typography>
              </Paper>
          )}
        </Box>
    </Box>
  );
};

export default Insights; 
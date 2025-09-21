import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { 
  Psychology, 
  Add, 
  Favorite, 
  Work, 
  School, 
  People, 
  HealthAndSafety, 
  Home,
  Celebration,
  PsychologyAlt,
  SportsEsports,
  Restaurant,
  Flight,
  Pets,
  MusicNote,
  Movie,
  ShoppingCart,
  DirectionsRun,
  Spa,
  BeachAccess,
  Mic,
  MicOff,
  Delete,
  Close as CloseIcon,
  BarChart
} from '@mui/icons-material';
import axios from 'axios';
import Profile from './Profile';
import { useSidebar } from '../context/SidebarContext';

const API_BASE_URL = 'https://personal-journal-ai-production.up.railway.app/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Beautiful mood options with emojis and colors
const moodOptions = [
  { emoji: '😊', label: 'Happy', color: '#FFD93D', bgColor: '#FFF9C4' },
  { emoji: '😔', label: 'Sad', color: '#6C757D', bgColor: '#F8F9FA' },
  { emoji: '😤', label: 'Frustrated', color: '#FF6B6B', bgColor: '#FFE5E5' },
  { emoji: '😰', label: 'Anxious', color: '#FFA726', bgColor: '#FFF3E0' },
  { emoji: '😴', label: 'Tired', color: '#9C27B0', bgColor: '#F3E5F5' },
  { emoji: '🤔', label: 'Contemplative', color: '#607D8B', bgColor: '#ECEFF1' },
  { emoji: '😌', label: 'Peaceful', color: '#4CAF50', bgColor: '#E8F5E8' },
  { emoji: '🤩', label: 'Excited', color: '#FF5722', bgColor: '#FFEBEE' },
  { emoji: '😢', label: 'Crying', color: '#2196F3', bgColor: '#E3F2FD' },
  { emoji: '😡', label: 'Angry', color: '#D32F2F', bgColor: '#FFEBEE' },
  { emoji: '😍', label: 'In Love', color: '#E91E63', bgColor: '#FCE4EC' },
  { emoji: '😎', label: 'Confident', color: '#00BCD4', bgColor: '#E0F7FA' },
];

// Reason categories with icons and colors
const reasonCategories = [
  { icon: <School />, label: 'Study', color: '#3F51B5', bgColor: '#E8EAF6' },
  { icon: <Work />, label: 'Career', color: '#FF9800', bgColor: '#FFF3E0' },
  { icon: <People />, label: 'Family', color: '#4CAF50', bgColor: '#E8F5E8' },
  { icon: <Favorite />, label: 'Relationship', color: '#E91E63', bgColor: '#FCE4EC' },
  { icon: <Home />, label: 'Home', color: '#795548', bgColor: '#EFEBE9' },
  { icon: <HealthAndSafety />, label: 'Health', color: '#F44336', bgColor: '#FFEBEE' },
  { icon: <Celebration />, label: 'Social', color: '#9C27B0', bgColor: '#F3E5F5' },
  { icon: <PsychologyAlt />, label: 'Mental Health', color: '#607D8B', bgColor: '#ECEFF1' },
  { icon: <SportsEsports />, label: 'Hobby', color: '#00BCD4', bgColor: '#E0F7FA' },
  { icon: <Restaurant />, label: 'Food', color: '#FF5722', bgColor: '#FFEBEE' },
  { icon: <Flight />, label: 'Travel', color: '#2196F3', bgColor: '#E3F2FD' },
  { icon: <Pets />, label: 'Pets', color: '#8BC34A', bgColor: '#F1F8E9' },
  { icon: <MusicNote />, label: 'Music', color: '#9E9E9E', bgColor: '#FAFAFA' },
  { icon: <Movie />, label: 'Entertainment', color: '#673AB7', bgColor: '#EDE7F6' },
  { icon: <ShoppingCart />, label: 'Shopping', color: '#FFC107', bgColor: '#FFF8E1' },
  { icon: <DirectionsRun />, label: 'Fitness', color: '#4CAF50', bgColor: '#E8F5E8' },
  { icon: <Spa />, label: 'Self-Care', color: '#E91E63', bgColor: '#FCE4EC' },
  { icon: <BeachAccess />, label: 'Nature', color: '#009688', bgColor: '#E0F2F1' },
];

const Journal = ({ onProfileUpdate }) => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachingLoading, setCoachingLoading] = useState({});
  const [error, setError] = useState('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showReasonSelector, setShowReasonSelector] = useState(false);
  const [showInsights, setShowInsights] = useState({});
  const [showFollowUp, setShowFollowUp] = useState({});
  const [followUpQuestion, setFollowUpQuestion] = useState({});
  const [followUpLoading, setFollowUpLoading] = useState({});
  const [followUpResponses, setFollowUpResponses] = useState({});
  const [expandedResponses, setExpandedResponses] = useState({});
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('today');
  const [feedbackStates, setFeedbackStates] = useState({}); // Track feedback button states
  const [showMoodFollowUp, setShowMoodFollowUp] = useState({}); // Track mood follow-up questions
  const [moodFollowUpQuestion, setMoodFollowUpQuestion] = useState({}); // Store follow-up responses
  const [moodFollowUpLoading, setMoodFollowUpLoading] = useState({}); // Loading state for follow-up
  const [personalCopingStrategies, setPersonalCopingStrategies] = useState([]); // Store user's coping strategies
  const [capabilityScore, setCapabilityScore] = useState(null); // Problem-solving capability score
  const [showCapabilityAssessment, setShowCapabilityAssessment] = useState(false); // Show capability score
  const [showGeneralAdvice, setShowGeneralAdvice] = useState({}); // Track general advice display
  const [showPersonalizedAdvice, setShowPersonalizedAdvice] = useState({}); // Track personalized advice display
  const [quickAdvice, setQuickAdvice] = useState({ show: false, strategies: [], entryId: null }); // Track quick advice
  const [readMoreContent, setReadMoreContent] = useState({ open: false, title: '', content: '' }); // Track read more popup
  const chatContainerRefs = useRef({});

  // Voice-to-text functionality
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Profile and sidebar functionality
  const [showProfile, setShowProfile] = useState(false);
  const { sidebarOpen, closeSidebar } = useSidebar();
  const [user, setUser] = useState(null);

  // Ensure journal entries are hidden by default on page load
  useEffect(() => {
    setShowJournalEntries(false);
    setSelectedDateFilter('today'); // Set default filter to 'today'
    fetchUserProfile();
  }, []);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    fetchEntries();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders()
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Handle profile update
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    // Also notify the parent App component
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };



  // Auto-scroll to bottom when new follow-up responses are added
  useEffect(() => {
    Object.keys(followUpResponses).forEach(entryId => {
      const chatContainer = chatContainerRefs.current[entryId];
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }, [followUpResponses]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/entries`, {
        headers: getAuthHeaders()
      });
      setEntries(response.data);

      // Hydrate mood follow-up state from persisted entries
      const hydrated = {};
      (response.data || []).forEach((entry) => {
        const mf = entry.moodFollowUp || {};
        // Hydrate if there are ANY mood follow-up responses, including empty strings
        // This ensures that once a user answers, the question never shows again
        if (mf.hasOwnProperty('feeling_better') || mf.hasOwnProperty('what_helped')) {
          hydrated[entry.id] = {
            feeling_better: mf.feeling_better || null,
            what_helped: mf.what_helped || null,
            whatHelpedInput: ''
          };
          console.log('Hydrated entry', entry.id, 'with moodFollowUp:', mf);
        }
      });
      setMoodFollowUpQuestion(hydrated);
      console.log('Final hydrated state:', hydrated);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
  };

  const handleReasonToggle = (reason) => {
    setSelectedReasons(prev => 
      prev.find(r => r.label === reason.label)
        ? prev.filter(r => r.label !== reason.label)
        : [...prev, reason]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedMood) {
      setError('Please fill in content and select a mood');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const reasonTags = selectedReasons.map(r => r.label);
      const allTags = [...tagArray, ...reasonTags];
      
      const response = await axios.post(`${API_BASE_URL}/entries`, {
        content: content.trim(),
        mood: `${selectedMood.emoji} ${selectedMood.label}`,
        tags: allTags,
      }, {
        headers: getAuthHeaders()
      });

      setEntries([response.data, ...entries]);
      setContent('');
      setSelectedMood(null);
      setSelectedReasons([]);
      setTags('');
    } catch (error) {
      setError('Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  const getCoachingAdvice = async (entryId) => {
    console.log('Getting coaching advice for entry:', entryId);
    setCoachingLoading(prev => ({ ...prev, [entryId]: true }));
    
    try {
      const response = await axios.post(`${API_BASE_URL}/coaching/${entryId}`, {}, {
        headers: getAuthHeaders()
      });
      console.log('Coaching response:', response.data);
      
      const updatedEntries = entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, aiInsight: response.data.coachingAdvice }
          : entry
      );
      setEntries(updatedEntries);
      // Show the insight after getting it
      setShowInsights(prev => ({ ...prev, [entryId]: true }));
      console.log('Updated entries:', updatedEntries);
    } catch (error) {
      console.error('Coaching advice error:', error);
      setError('Failed to get coaching advice');
    } finally {
      setCoachingLoading(prev => ({ ...prev, [entryId]: false }));
    }
  };

  // Check if entry has negative emotions that need follow-up
  const hasNegativeEmotions = (entry) => {
    const negativeEmotions = ['anxious', 'angry', 'sad', 'stressed', 'worried', 'frustrated', 'depressed', 'lonely', 'crying'];
    const entryText = (entry.content || '').toLowerCase();
    const entryTags = (entry.tags || []).map(tag => String(tag).toLowerCase());
    const moodText = (entry.mood || '').toLowerCase();
    
    return negativeEmotions.some(emotion => 
      entryText.includes(emotion) ||
      entryTags.some(tag => tag.includes(emotion)) ||
      moodText.includes(emotion)
    );
  };

  // Handle mood follow-up questions
  const handleMoodFollowUp = async (entryId, question, answer) => {
    console.log('handleMoodFollowUp called:', entryId, question, answer);
    setMoodFollowUpLoading(prev => ({ ...prev, [entryId]: true }));
    
    // IMMEDIATELY update the state to prevent UI flickering
    setMoodFollowUpQuestion(prev => {
      const currentEntryState = prev[entryId] || {};
      const newState = {
        ...prev,
        [entryId]: { 
          ...currentEntryState, 
          [question]: answer,
          whatHelpedInput: question === 'what_helped' ? '' : (currentEntryState.whatHelpedInput || '')
        }
      };
      console.log('IMMEDIATE State update - entryId:', entryId, 'question:', question, 'answer:', answer);
      console.log('Previous state for this entry:', currentEntryState);
      console.log('New state for this entry:', newState[entryId]);
      console.log('Updated moodFollowUpQuestion state:', newState);
      return newState;
    });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/mood-followup/${entryId}`, {
        question,
        answer
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Mood follow-up response:', response.data);
      
      // Store the coping strategy if user shared what helped
      if (question === 'what_helped' && answer.trim()) {
        setPersonalCopingStrategies(prev => [...prev, {
          emotion: 'anxious', // This could be more dynamic
          strategy: answer.trim(),
          date: new Date().toISOString()
        }]);
      }
      
      // If user said "no" to feeling better, show general advice
      if (question === 'feeling_better' && answer === 'no') {
        console.log('User said no to feeling better for entry:', entryId);
        // Show general advice or just hide the question
      }
      
      // If user said "yes" to feeling better, ask what helped
      if (question === 'feeling_better' && answer === 'yes') {
        console.log('User said yes to feeling better for entry:', entryId);
        console.log('State after answering yes:', moodFollowUpQuestion[entryId]);
        // The "what helped" question will automatically show based on the state
      }
      
      // Double-check that the state is properly maintained
      console.log('Final state check after API call for entry:', entryId, ':', moodFollowUpQuestion[entryId]);
      
    } catch (error) {
      console.error('Mood follow-up error:', error);
      setError('Failed to save follow-up response');
      
      // Revert the state if the API call failed
      setMoodFollowUpQuestion(prev => {
        const currentEntryState = prev[entryId] || {};
        const newState = {
          ...prev,
          [entryId]: { 
            ...currentEntryState, 
            [question]: undefined, // Revert the answer
            whatHelpedInput: currentEntryState.whatHelpedInput || ''
          }
        };
        console.log('Reverted state due to API error:', newState);
        return newState;
      });
    } finally {
      setMoodFollowUpLoading(prev => ({ ...prev, [entryId]: false }));
    }
  };

  // Handle what helped submission
  const handleWhatHelpedSubmit = async (entryId) => {
    const whatHelpedValue = moodFollowUpQuestion[entryId]?.whatHelpedInput;
    if (!whatHelpedValue?.trim()) return;
    
    await handleMoodFollowUp(entryId, 'what_helped', whatHelpedValue.trim());
    
    // Immediately update the local state to prevent the question from reappearing
    setMoodFollowUpQuestion(prev => ({
      ...prev,
      [entryId]: { 
        ...prev[entryId], 
        what_helped: whatHelpedValue.trim(),
        whatHelpedInput: '' 
      }
    }));
  };

  // Handle closing what helped section (save current input if any)
  const handleCloseWhatHelped = async (entryId) => {
    const whatHelpedValue = moodFollowUpQuestion[entryId]?.whatHelpedInput;
    
    // If there's input text, save it before closing
    if (whatHelpedValue?.trim()) {
      await handleMoodFollowUp(entryId, 'what_helped', whatHelpedValue.trim());
      
      // Immediately update the local state to prevent the question from reappearing
      setMoodFollowUpQuestion(prev => ({
        ...prev,
        [entryId]: { 
          ...prev[entryId], 
          what_helped: whatHelpedValue.trim(),
          whatHelpedInput: '',
          feeling_better: 'yes' // Ensure feeling_better stays 'yes'
        }
      }));
    } else {
      // If no input, just close without saving anything
      // This means user didn't provide what helped them feel better
      setMoodFollowUpQuestion(prev => ({
        ...prev,
        [entryId]: { 
          ...prev[entryId], 
          what_helped: 'NO_INPUT_PROVIDED', // Mark that user didn't provide input
          whatHelpedInput: '',
          feeling_better: 'yes' // Ensure feeling_better stays 'yes'
        }
      }));
    }
  };

  // Delete journal entry
  const deleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/entries/${entryId}`, {
        headers: getAuthHeaders()
      });
      
      // Remove the entry from the local state
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      // Clean up any related state
      setShowInsights(prev => {
        const newState = { ...prev };
        delete newState[entryId];
        return newState;
      });
      
      setShowFollowUp(prev => {
        const newState = { ...prev };
        delete newState[entryId];
        return newState;
      });
      
      setMoodFollowUpQuestion(prev => {
        const newState = { ...prev };
        delete newState[entryId];
        return newState;
      });
      
      setShowMoodFollowUp(prev => {
        const newState = { ...prev };
        delete newState[entryId];
        return newState;
      });
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete journal entry');
    }
  };

  // Voice-to-text functionality
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setContent(prev => prev + finalTranscript + ' ');
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Handle OK button clicks
  const handleOkClick = (entryId, type) => {
    if (type === 'general') {
      // Removed setShowGeneralAdvice since that section was removed to prevent duplication
      // Ask again if they're feeling better
      setMoodFollowUpQuestion(prev => ({
        ...prev,
        [entryId]: { ...prev[entryId], feeling_better: null }
      }));
    } else if (type === 'personalized') {
      setShowPersonalizedAdvice(prev => ({ ...prev, [entryId]: false }));
    }
  };

  // Get personalized coaching
  const getPersonalizedCoaching = async (entryId) => {
    setCoachingLoading(prev => ({ ...prev, [entryId]: true }));
    
    try {
      const response = await axios.post(`${API_BASE_URL}/personalized-coaching/${entryId}`, {
        personalStrategies: personalCopingStrategies,
        currentEntry: entries.find(e => e.id === entryId)
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Personalized coaching response:', response.data);
      
      const updatedEntries = entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, aiInsight: response.data.coachingAdvice }
          : entry
      );
      setEntries(updatedEntries);
      setShowPersonalizedAdvice(prev => ({ ...prev, [entryId]: true }));
      setShowInsights(prev => ({ ...prev, [entryId]: true }));
    } catch (error) {
      console.error('Personalized coaching error:', error);
      setError('Failed to get personalized coaching advice');
    } finally {
      setCoachingLoading(prev => ({ ...prev, [entryId]: false }));
    }
  };

  // Get capability assessment score
  const getCapabilityAssessment = async (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/capability-assessment/${entryId}`, {
        personalStrategies: personalCopingStrategies,
        currentEntry: entry,
        allEntries: entries
      }, {
        headers: getAuthHeaders()
      });
      
      // Set the capability score from the response
      setCapabilityScore(response.data.capabilityScore);
      
      // Update the entry with capability assessment
      const updatedEntries = entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, capabilityAssessment: response.data }
          : entry
      );
      setEntries(updatedEntries);
      
      // Show the assessment
      setShowCapabilityAssessment(true);
    } catch (error) {
      console.error('Capability assessment error:', error);
      setError('Failed to get capability assessment');
    }
  };

  // Get quick personalized advice (keyword-based)
  const getQuickPersonalizedAdvice = async (entryId) => {
    const currentEntry = entries.find(e => e.id === entryId);
    if (!currentEntry) return;
    
    try {
      // Analyze past entries to find effective strategies
      const pastEntries = entries.filter(e => e.id !== entryId && e.moodFollowUp?.what_helped);
      const strategies = [];
      
      // Extract strategies from past "what helped" responses
      pastEntries.forEach(entry => {
        if (entry.moodFollowUp?.what_helped) {
          const strategy = entry.moodFollowUp.what_helped.toLowerCase();
          if (strategy.includes('coffee') || strategy.includes('tea')) {
            strategies.push('☕ Drink coffee/tea');
          } else if (strategy.includes('walk') || strategy.includes('exercise')) {
            strategies.push('🚶 Go for a walk');
          } else if (strategy.includes('music') || strategy.includes('song')) {
            strategies.push('🎵 Listen to music');
          } else if (strategy.includes('meditation') || strategy.includes('breath')) {
            strategies.push('🧘 Meditate');
          } else if (strategy.includes('friend') || strategy.includes('call')) {
            strategies.push('📞 Call a friend');
          } else if (strategy.includes('chocolate') || strategy.includes('sweet')) {
            strategies.push('🍫 Eat chocolate');
          } else if (strategy.includes('journal') || strategy.includes('write')) {
            strategies.push('✍️ Write in journal');
          } else if (strategy.includes('sleep') || strategy.includes('rest')) {
            strategies.push('😴 Take a nap');
          } else if (strategy.includes('shower') || strategy.includes('bath')) {
            strategies.push('🚿 Take a shower');
          } else {
            strategies.push(`✨ ${entry.moodFollowUp.what_helped}`);
          }
        }
      });
      
      // Remove duplicates and get unique strategies
      const uniqueStrategies = [...new Set(strategies)];
      
      // If no past strategies, provide default suggestions
      const defaultStrategies = [
        '☕ Drink coffee/tea',
        '🚶 Go for a walk', 
        '🎵 Listen to music',
        '🧘 Meditate',
        '📞 Call a friend',
        '🍫 Eat chocolate',
        '✍️ Write in journal',
        '😴 Take a nap'
      ];
      
      const finalStrategies = uniqueStrategies.length > 0 ? uniqueStrategies.slice(0, 6) : defaultStrategies;
      
      // Show the advice in a popup
      setQuickAdvice({
        show: true,
        strategies: finalStrategies,
        entryId: entryId
      });
      
    } catch (error) {
      console.error('Quick advice error:', error);
      setError('Failed to get personalized advice');
    }
  };

  const handleFeedbackClick = (entryId, feedbackType) => {
    console.log('Feedback button clicked:', entryId, feedbackType);
    setFeedbackStates(prev => {
      const newState = {
        ...prev,
        [`${entryId}-${feedbackType}`]: !prev[`${entryId}-${feedbackType}`]
      };
      console.log('New feedback states:', newState);
      return newState;
    });
  };

  const sendFollowUpQuestion = async (entryId) => {
    const question = followUpQuestion[entryId];
    if (!question?.trim()) return;

    setFollowUpLoading(prev => ({ ...prev, [entryId]: true }));
    
    try {
      const response = await axios.post(`${API_BASE_URL}/coaching/${entryId}/followup`, {
        question: question.trim()
      });
      
      setFollowUpResponses(prev => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), {
          question: question.trim(),
          response: response.data.followUpResponse,
          timestamp: new Date().toISOString()
        }]
      }));
      
      setFollowUpQuestion(prev => ({ ...prev, [entryId]: '' }));
    } catch (error) {
      console.error('Follow-up error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to send follow-up question. Please try again.');
      }
    } finally {
      setFollowUpLoading(prev => ({ ...prev, [entryId]: false }));
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

  const formatResponse = (text) => {
    return text
      .replace(/\*\*/g, '') // Remove bold asterisks
      .replace(/\*/g, '') // Remove single asterisks
      .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
      .trim();
  };

  const formatContent = (content) => {
    return content
      .replace(/\*\*/g, '') // Remove bold asterisks
      .replace(/\*/g, '') // Remove single asterisks
      .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
      .split('\n')
      .map(line => {
        const trimmedLine = line.trim();
        // Check if this is a subtitle (starts with * and ends with :)
        if (trimmedLine.startsWith('*') && trimmedLine.includes(':')) {
          const subtitle = trimmedLine.replace(/^\*\s*/, '').replace(/:\s*$/, '');
          return `\n**${subtitle}:**\n`;
        }
        // Check if this is a bullet point (starts with * but doesn't end with :)
        if (trimmedLine.startsWith('*') && !trimmedLine.includes(':')) {
          const bulletContent = trimmedLine.replace(/^\*\s*/, '');
          return `\n• ${bulletContent}`;
        }
        // Check if this is a numbered list item
        if (/^\d+\./.test(trimmedLine)) {
          return `\n${trimmedLine}`;
        }
        return line;
      })
      .join('\n')
      .trim();
  };

  const truncateResponse = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filterEntriesByDate = (entries) => {
    if (selectedDateFilter === 'all') return entries;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const pastWeek = new Date(today);
    pastWeek.setDate(pastWeek.getDate() - 7);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      
      switch (selectedDateFilter) {
        case 'today':
          return entryDate >= today;
        case 'yesterday':
          return entryDate >= yesterday && entryDate < today;
        case 'pastWeek':
          return entryDate >= pastWeek;
        case 'specific':
          if (!selectedDate) return true;
          const selected = new Date(selectedDate);
          return entryDate >= selected && entryDate < new Date(selected.getTime() + 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={closeSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              👤 Profile
            </Typography>
            <IconButton onClick={closeSidebar} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {user && (
            <Profile onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Centered Write Your Thoughts */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            ✨ Write Your Thoughts ✨
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Journal Entry Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Content Input */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, feelings, experiences, or anything you'd like to reflect on..."
              />
              <IconButton
                onClick={toggleListening}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: isListening ? '#ff4444' : '#667eea',
                  color: 'white',
                  '&:hover': {
                    background: isListening ? '#cc0000' : '#5a6fd8',
                  },
                  transition: 'all 0.3s ease',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            </Box>

            {/* Mood Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
                🎭 How are you feeling today?
              </Typography>
              
              {selectedMood ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    fontSize: '2rem',
                    background: selectedMood.bgColor,
                    color: selectedMood.color,
                    mr: 2,
                    border: `3px solid ${selectedMood.color}`
                  }}>
                    {selectedMood.emoji}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: selectedMood.color }}>
                      {selectedMood.label}
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setSelectedMood(null)}
                      sx={{ color: selectedMood.color }}
                    >
                      Change Mood
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setShowMoodSelector(!showMoodSelector)}
                  sx={{ 
                    border: '2px dashed #ccc',
                    borderRadius: 3,
                    p: 1.5,
                    width: '100%',
                    height: 60,
                    fontSize: '1rem'
                  }}
                >
                  🎭 Select Your Mood
                </Button>
              )}

              {/* Mood Selector */}
              {showMoodSelector && (
                <Fade in={showMoodSelector}>
                  <Box sx={{ 
                    mt: 1, 
                    p: 2, 
                    background: 'rgba(255,255,255,0.9)', 
                    borderRadius: 3,
                    border: '2px solid #f0f0f0'
                  }}>
                    <Grid container spacing={2}>
                      {moodOptions.map((mood, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Zoom in={showMoodSelector} style={{ transitionDelay: `${index * 50}ms` }}>
                            <Tooltip title={mood.label}>
                              <IconButton
                                onClick={() => handleMoodSelect(mood)}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  background: mood.bgColor,
                                  border: `3px solid ${mood.color}`,
                                  '&:hover': {
                                    background: mood.color,
                                    transform: 'scale(1.1)',
                                    boxShadow: `0 8px 25px ${mood.color}40`
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <Typography variant="h4">
                                  {mood.emoji}
                                </Typography>
                              </IconButton>
                            </Tooltip>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Reason Categories */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
                🎯 What's this about? (Select all that apply)
              </Typography>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowReasonSelector(!showReasonSelector)}
                sx={{ 
                  border: '2px dashed #ccc',
                  borderRadius: 3,
                  p: 2,
                  width: '100%',
                  height: 60,
                  fontSize: '1rem'
                }}
              >
                🎯 Select Related Topics
              </Button>

              {/* Selected Reasons Display */}
              {selectedReasons.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedReasons.map((reason, index) => (
                    <Chip
                      key={index}
                      icon={reason.icon}
                      label={reason.label}
                      onDelete={() => handleReasonToggle(reason)}
                      sx={{
                        background: reason.bgColor,
                        color: reason.color,
                        fontWeight: 'bold',
                        '& .MuiChip-deleteIcon': {
                          color: reason.color
                        }
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Reason Selector */}
              {showReasonSelector && (
                <Fade in={showReasonSelector}>
                  <Box sx={{ 
                    mt: 1, 
                    p: 2, 
                    background: 'rgba(255,255,255,0.9)', 
                    borderRadius: 3,
                    border: '2px solid #f0f0f0'
                  }}>
                    <Grid container spacing={2}>
                      {reasonCategories.map((reason, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Zoom in={showReasonSelector} style={{ transitionDelay: `${index * 30}ms` }}>
                            <Tooltip title={reason.label}>
                              <IconButton
                                onClick={() => handleReasonToggle(reason)}
                                sx={{
                                  width: '100%',
                                  height: 60,
                                  background: selectedReasons.find(r => r.label === reason.label) 
                                    ? reason.color 
                                    : reason.bgColor,
                                  color: selectedReasons.find(r => r.label === reason.label) 
                                    ? 'white' 
                                    : reason.color,
                                  border: `2px solid ${reason.color}`,
                                  borderRadius: 2,
                                  '&:hover': {
                                    background: reason.color,
                                    color: 'white',
                                    transform: 'scale(1.05)',
                                    boxShadow: `0 4px 15px ${reason.color}40`
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {reason.icon}
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {reason.label}
                                  </Typography>
                                </Box>
                              </IconButton>
                            </Tooltip>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Additional Tags */}
            <TextField
              fullWidth
              variant="outlined"
              label="Additional tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g., goals, reflection, gratitude, challenges"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !content.trim() || !selectedMood}
              startIcon={loading ? <CircularProgress size={20} /> : <Add />}
              sx={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Saving...' : '✨ Save Journal Entry ✨'}
            </Button>
          </form>
        </Paper>

        {/* Journal Entries */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            📖 Your Journal Entries
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => setShowJournalEntries(!showJournalEntries)}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {showJournalEntries ? 'Hide Journals' : 'See Journals'}
          </Button>
        </Box>

        {showJournalEntries && (
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              📅 Filter by Date
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label="All Entries"
                onClick={() => setSelectedDateFilter('all')}
                sx={{
                  background: selectedDateFilter === 'all' ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102,126,234,0.1)',
                  color: selectedDateFilter === 'all' ? 'white' : '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedDateFilter === 'all' ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' : 'rgba(102,126,234,0.2)'
                  }
                }}
              />
              <Chip
                label="Today"
                onClick={() => setSelectedDateFilter('today')}
                sx={{
                  background: selectedDateFilter === 'today' ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102,126,234,0.1)',
                  color: selectedDateFilter === 'today' ? 'white' : '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedDateFilter === 'today' ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' : 'rgba(102,126,234,0.2)'
                  }
                }}
              />
              <Chip
                label="Yesterday"
                onClick={() => setSelectedDateFilter('yesterday')}
                sx={{
                  background: selectedDateFilter === 'yesterday' ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102,126,234,0.1)',
                  color: selectedDateFilter === 'yesterday' ? 'white' : '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedDateFilter === 'yesterday' ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' : 'rgba(102,126,234,0.2)'
                  }
                }}
              />
              <Chip
                label="Past Week"
                onClick={() => setSelectedDateFilter('pastWeek')}
                sx={{
                  background: selectedDateFilter === 'pastWeek' ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102,126,234,0.1)',
                  color: selectedDateFilter === 'pastWeek' ? 'white' : '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedDateFilter === 'pastWeek' ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' : 'rgba(102,126,234,0.2)'
                  }
                }}
              />
              <TextField
                type="date"
                value={selectedDate || ''}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedDateFilter('specific');
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        )}

        {!showJournalEntries ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Click "See Journals" to view your entries! 📖✨
            </Typography>
          </Paper>
        ) : showJournalEntries && entries.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No entries yet. Start your journaling journey! ✨
            </Typography>
          </Paper>
        ) : showJournalEntries && (
          <Grid container spacing={3}>
            {filterEntriesByDate(entries).map((entry) => (
              <Grid item xs={12} key={entry.id}>
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span role="img" aria-label="calendar" style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji", sans-serif' }}>📅</span> {formatDate(entry.timestamp)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={entry.mood}
                          size="medium" 
                          sx={{ 
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        />
                        <Tooltip title="Delete this entry">
                          <IconButton
                            onClick={() => deleteEntry(entry.id)}
                            sx={{
                              color: '#ff6b6b',
                              '&:hover': {
                                background: 'rgba(255, 107, 107, 0.1)',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '1.1rem' }}>
                      {entry.content}
                    </Typography>

                    {entry.tags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          🏷️ Tags:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {entry.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Mood Follow-up Questions for Negative Emotions */}
                    {(() => {
                      const hasNegative = hasNegativeEmotions(entry);
                      const feelingBetter = moodFollowUpQuestion[entry.id]?.feeling_better;
                      
                      // Show only if user hasn't answered the question yet
                      // Once they answer yes/no, NEVER show the question again
                      // Use hasOwnProperty to check if the question was ever answered
                      const hasAnsweredFeelingBetter = moodFollowUpQuestion[entry.id] && 
                        moodFollowUpQuestion[entry.id].hasOwnProperty('feeling_better');
                      const shouldShowQuestion = hasNegative && !hasAnsweredFeelingBetter;
                      
                      console.log('Button condition check for entry', entry.id, ':', {
                        hasNegative,
                        feelingBetter,
                        hasAnsweredFeelingBetter,
                        shouldShow: shouldShowQuestion
                      });
                      
                      return shouldShowQuestion;
                    })() && (
                      <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                          💙 Are you okay now?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMoodFollowUp(entry.id, 'feeling_better', 'yes')}
                            disabled={moodFollowUpLoading[entry.id]}
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          >
                            {moodFollowUpLoading[entry.id] ? 'Saving...' : 'Yes, I feel better'}
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMoodFollowUp(entry.id, 'feeling_better', 'no')}
                            disabled={moodFollowUpLoading[entry.id]}
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          >
                            {moodFollowUpLoading[entry.id] ? 'Saving...' : 'Not really'}
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* What Helped You Feel Better Question */}
                    {(() => {
                      const entryState = moodFollowUpQuestion[entry.id] || {};
                      const hasAnsweredWhatHelped = entryState.what_helped && entryState.what_helped.trim() !== '' && entryState.what_helped !== 'CLOSED_WITHOUT_ANSWER';
                      const shouldShowWhatHelped = entryState.feeling_better === 'yes' && !hasAnsweredWhatHelped;
                      
                      console.log('What helped condition check for entry', entry.id, ':', {
                        entryState,
                        feeling_better: entryState.feeling_better,
                        what_helped: entryState.what_helped,
                        hasAnsweredWhatHelped,
                        shouldShowWhatHelped
                      });
                      
                      return shouldShowWhatHelped;
                    })() && (
                      <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                          🌟 What helped you feel better?
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', mb: 2, opacity: 0.9 }}>
                          Share what worked for you - this helps me give you better advice next time!
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <TextField
                            fullWidth
                            placeholder="What helped you feel better?"
                            value={moodFollowUpQuestion[entry.id]?.whatHelpedInput || ''}
                            onChange={(e) => setMoodFollowUpQuestion(prev => ({
                              ...prev,
                              [entry.id]: { ...prev[entry.id], whatHelpedInput: e.target.value }
                            }))}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: !moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim() 
                                    ? 'rgba(255, 165, 0, 0.7)' // Orange border when empty
                                    : 'rgba(255,255,255,0.3)'
                                },
                                '&:hover fieldset': {
                                  borderColor: !moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim()
                                    ? 'rgba(255, 165, 0, 0.9)' // Darker orange on hover when empty
                                    : 'rgba(255,255,255,0.5)'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: !moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim()
                                    ? 'rgba(255, 165, 0, 1)' // Solid orange when focused and empty
                                    : 'white'
                                },
                                '& input::placeholder': {
                                  color: !moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim()
                                    ? 'rgba(255, 165, 0, 0.8)' // Orange placeholder when empty
                                    : 'rgba(255,255,255,0.7)'
                                }
                              }
                            }}
                          />
                          {/* Helper text to show input status */}
                          {!moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim() && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'rgba(255, 165, 0, 0.8)', 
                                fontSize: '0.75rem',
                                mt: 0.5,
                                fontStyle: 'italic'
                              }}
                            >
                              ⚠️ Please enter what helped you feel better, or click ✕ to close
                            </Typography>
                          )}
                          <Button
                            variant="contained"
                            onClick={() => handleWhatHelpedSubmit(entry.id)}
                            disabled={moodFollowUpLoading[entry.id] || !moodFollowUpQuestion[entry.id]?.whatHelpedInput?.trim()}
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          >
                            {moodFollowUpLoading[entry.id] ? 'Saving...' : 'Save'}
                          </Button>
                          <IconButton
                            onClick={() => handleCloseWhatHelped(entry.id)}
                            sx={{
                              color: 'white',
                              background: 'rgba(255,255,255,0.2)',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    )}

                    {/* Personalized Suggestions for When User Doesn't Feel Better */}
                    {moodFollowUpQuestion[entry.id]?.feeling_better === 'no' && (
                      <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)', borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                          💪 Let's help you feel better!
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', mb: 2, opacity: 0.9 }}>
                          Based on your previous experiences, here are some personalized suggestions:
                        </Typography>
                        
                        {personalCopingStrategies.length > 0 ? (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                              What worked for you before:
                            </Typography>
                            {personalCopingStrategies.slice(-3).map((strategy, index) => (
                              <Chip
                                key={index}
                                label={`${strategy.strategy} (when feeling ${strategy.emotion})`}
                                sx={{
                                  background: 'rgba(255,255,255,0.2)',
                                  color: 'white',
                                  m: 0.5,
                                  '&:hover': {
                                    background: 'rgba(255,255,255,0.3)'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'white', mb: 2, opacity: 0.9 }}>
                            Try these general strategies:
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip label="Take deep breaths" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          <Chip label="Go for a walk" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          <Chip label="Listen to music" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          <Chip label="Call a friend" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          <Chip label="Write in journal" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => getQuickPersonalizedAdvice(entry.id)}
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          >
                            Get Personalized Advice
                          </Button>
                          
                          <Button
                            variant="outlined"
                            onClick={() => setMoodFollowUpQuestion(prev => ({
                              ...prev,
                              [entry.id]: { ...prev[entry.id], feeling_better: null }
                            }))}
                            sx={{
                              borderColor: 'rgba(255,255,255,0.5)',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                borderColor: 'white',
                                background: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          >
                            OK
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Thank You Message */}
                    {moodFollowUpQuestion[entry.id]?.what_helped && 
                     moodFollowUpQuestion[entry.id]?.what_helped !== 'NO_INPUT_PROVIDED' && 
                     moodFollowUpQuestion[entry.id]?.what_helped.trim() && (
                      <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: 3, position: 'relative' }}>
                        {/* Close Button */}
                        <IconButton
                          onClick={() => {
                            setMoodFollowUpQuestion(prev => ({
                              ...prev,
                              [entry.id]: { 
                                ...prev[entry.id], 
                                what_helped: null,
                                feeling_better: null,
                                whatHelpedInput: ''
                              }
                            }));
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            background: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.3)'
                            }
                          }}
                        >
                          ✕
                        </IconButton>
                        
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontFamily: 'cursive', fontSize: '1.5rem' }}>
                          ✨ "{moodFollowUpQuestion[entry.id]?.what_helped}" worked!
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                          I've saved this information. Next time you feel similar emotions, I'll remind you about what helped before!
                        </Typography>
                      </Box>
                    )}

                    {/* No Input Provided Message */}
                    {moodFollowUpQuestion[entry.id]?.what_helped === 'NO_INPUT_PROVIDED' && (
                      <Box sx={{ mt: 3, p: 3, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 3, border: '2px solid #ffc107', position: 'relative' }}>
                        {/* Close Button */}
                        <IconButton
                          onClick={() => {
                            setMoodFollowUpQuestion(prev => ({
                              ...prev,
                              [entry.id]: { 
                                ...prev[entry.id], 
                                what_helped: null,
                                feeling_better: null,
                                whatHelpedInput: ''
                              }
                            }));
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#ff9800',
                            background: 'rgba(255, 193, 7, 0.2)',
                            '&:hover': {
                              background: 'rgba(255, 193, 7, 0.3)'
                            }
                          }}
                        >
                          ✕
                        </IconButton>
                        
                        <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold', mb: 2, fontFamily: 'cursive', fontSize: '1.5rem' }}>
                          No input provided
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ff9800', opacity: 0.9 }}>
                          You closed the input without providing what helped you feel better.
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {/* Get AI Insights Button */}
                      <Button
                        variant="contained"
                        onClick={() => getCoachingAdvice(entry.id)}
                        disabled={coachingLoading[entry.id]}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                          fontWeight: 'bold',
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {coachingLoading[entry.id] ? 'Getting Insights...' : 'Get AI Insights'}
                      </Button>
                      
                      {/* Get Personalized Coaching Button */}
                      <Button
                        variant="outlined"
                        onClick={() => getPersonalizedCoaching(entry.id)}
                        disabled={coachingLoading[entry.id]}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          fontWeight: 'bold',
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: '#5a6fd8',
                            background: 'rgba(102,126,234,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {coachingLoading[entry.id] ? 'Getting Advice...' : 'Get Personalized Coaching'}
                      </Button>
                      
                      {/* Capability Assessment - Only for negative moods */}
                      {hasNegativeEmotions(entry) && (
                        <Button
                          variant="outlined"
                          onClick={() => getCapabilityAssessment(entry.id)}
                          sx={{
                            borderColor: '#ff6b6b',
                            color: '#ff6b6b',
                            fontWeight: 'bold',
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#ff5252',
                              background: 'rgba(255,107,107,0.1)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Assess My Capability
                        </Button>
                      )}
                    </Box>

                    {entry.aiInsight && showInsights[entry.id] ? (
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          p: 3, 
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          {/* Close Button */}
                          <IconButton
                            onClick={() => setShowInsights(prev => ({ ...prev, [entry.id]: false }))}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'white',
                              background: 'rgba(255,255,255,0.2)',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.3)',
                                transform: 'scale(1.1)'
                              },
                              zIndex: 10,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            ✕
                          </IconButton>
                          
                          <Box sx={{ 
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            fontSize: 60,
                            opacity: 0.1
                          }}>
                            ✨
                          </Box>
                          
                          <Typography variant="h6" sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <Psychology sx={{ mr: 2, fontSize: 30 }} />
                            ✨ AI Coaching Insight ✨
                          </Typography>
                          
                          {/* Structured Insights Layout */}
                          <Box sx={{ 
                            position: 'relative', 
                            zIndex: 1,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 2,
                            mt: 2
                          }}>
                            {(() => {
                              // Parse the AI response into structured sections
                              console.log('Entry AI Insight:', entry.aiInsight); // Debug log
                              console.log('Entry ID:', entry.id); // Debug log
                              
                              if (!entry.aiInsight) {
                                console.log('No AI insight available for entry:', entry.id);
                                return <Typography color="white">No AI insight available</Typography>;
                              }
                              
                              const sections = [];
                              const lines = entry.aiInsight.split('\n');
                              console.log('Split lines:', lines); // Debug log
                              let currentSection = null;
                              
                              lines.forEach(line => {
                                const trimmedLine = line.trim();
                                console.log('Processing line:', trimmedLine); // Debug log
                                if (!trimmedLine) return;
                                
                                // Check for the new AI response format with **Section Name** headers
                                if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && !trimmedLine.includes(':')) {
                                  console.log('Found section header:', trimmedLine); // Debug log
                                  // Save previous section if exists
                                  if (currentSection) {
                                    sections.push(currentSection);
                                  }
                                  
                                  // Start new section - extract title between **
                                  const title = trimmedLine.replace(/\*\*/g, '').trim();
                                  
                                  currentSection = {
                                    title,
                                    content: '',
                                    type: title.toLowerCase()
                                  };
                                  console.log('Created new section:', currentSection); // Debug log
                                } else if (trimmedLine.startsWith('**') && trimmedLine.includes(':')) {
                                  console.log('Found section header with colon:', trimmedLine); // Debug log
                                  // Save previous section if exists
                                  if (currentSection) {
                                    sections.push(currentSection);
                                  }
                                  
                                  // Start new section - extract title before the colon
                                  const title = trimmedLine.replace(/\*\*/g, '').split(':')[0].trim();
                                  const contentAfterColon = trimmedLine.split(':').slice(1).join(':').trim();
                                  
                                  currentSection = {
                                    title,
                                    content: contentAfterColon,
                                    type: title.toLowerCase()
                                  };
                                  console.log('Created section with content:', currentSection); // Debug log
                                } else if (currentSection) {
                                  // Add content to current section (use original line to preserve formatting)
                                  currentSection.content += (currentSection.content ? '\n' : '') + line;
                                  console.log('Added content to section:', currentSection.title, 'Content:', currentSection.content); // Debug log
                                } else {
                                  // If no current section, create a default one
                                  currentSection = {
                                    title: 'AI Insight',
                                    content: line,
                                    type: 'insight'
                                  };
                                  console.log('Created default section:', currentSection); // Debug log
                                }
                              });
                              
                              // Don't forget to add the last section
                              if (currentSection) {
                                sections.push(currentSection);
                              }
                              
                              console.log('Parsed sections:', sections); // Debug log
                              
                              return sections.map((section, index) => {
                                const isCompassion = section.type.includes('compassion') || section.type.includes('recognition');
                                const isAdvice = section.type.includes('advice') || section.type.includes('actionable') || section.type.includes('tailored');
                                const isAffirmation = section.type.includes('affirmation') || section.type.includes('encouragement');
                                const isQuestion = section.type.includes('question') || section.type.includes('reflection') || section.type.includes('context');
                                
                                return (
                                  <Box
                                    key={index}
                                    sx={{
                                      background: isAdvice ? 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(102,126,234,0.05))' : 'rgba(255,255,255,0.08)',
                                      backdropFilter: 'blur(10px)',
                                      borderRadius: 3,
                                      p: 2.5,
                                      mb: 2.5,
                                      border: isAdvice ? '2px solid rgba(102,126,234,0.4)' : '2px solid rgba(255,255,255,0.2)',
                                      transition: 'all 0.3s ease',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      minHeight: '80px', // Ensure minimum height for better presentation
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: isAdvice ? '0 8px 25px rgba(102,126,234,0.3)' : '0 8px 25px rgba(0,0,0,0.2)',
                                        background: isAdvice ? 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(102,126,234,0.1))' : 'rgba(255,255,255,0.12)'
                                      },
                                      '&::before': isAdvice ? {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                        zIndex: 1
                                      } : {}
                                    }}
                                  >
                                    {/* Section Header */}
                                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                                      <Box sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        background: isCompassion ? '#FFD700' : 
                                                   isAdvice ? '#667eea' :
                                                   isAffirmation ? '#4ECDC4' : '#FF6B9D',
                                        mr: 1.5,
                                        boxShadow: `0 0 10px ${isCompassion ? 'rgba(255,215,0,0.5)' : 
                                                             isAdvice ? 'rgba(102,126,234,0.5)' :
                                                             isAffirmation ? 'rgba(78,205,196,0.5)' : 'rgba(255,107,157,0.5)'}`
                                      }} />
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          color: isCompassion ? '#FFD700' : 
                                                 isAdvice ? '#FFFFFF' :
                                                 isAffirmation ? '#4ECDC4' : '#FF6B9D',
                                          fontWeight: 'bold',
                                          fontSize: '1.2rem',
                                          textTransform: 'uppercase',
                                          letterSpacing: '1px',
                                          textShadow: isAdvice ? '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(102,126,234,0.6)' : 'none'
                                        }}
                                      >
                                        {section.title}
                                      </Typography>
                                    </Box>
                                    
                                    {/* Section Content */}
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        color: 'white',
                                        lineHeight: 1.8,
                                        fontSize: '1rem',
                                        fontWeight: 400,
                                        textAlign: 'left',
                                        fontStyle: isAffirmation ? 'italic' : 'normal',
                                        whiteSpace: 'pre-line'
                                      }}
                                    >
                                      {(() => {
                                        const content = section.content && section.content.trim() ? section.content : 'No content available';
                                        const lines = content.split('\n');
                                        
                                        // If content is short (less than 3 lines), show all
                                        if (lines.length <= 3) {
                                          return content;
                                        }
                                        
                                        // Show first 2 lines + "Read More" button
                                        const previewLines = lines.slice(0, 2);
                                        const remainingLines = lines.slice(2);
                                        
                                        return (
                                          <>
                                            {previewLines.join('\n')}
                                            <br />
                                            <Button
                                              size="small"
                                              onClick={() => setReadMoreContent({
                                                open: true,
                                                title: section.title,
                                                content: content
                                              })}
                                              sx={{
                                                mt: 1,
                                                color: 'white',
                                                borderColor: 'white',
                                                '&:hover': {
                                                  borderColor: 'white',
                                                  backgroundColor: 'rgba(255,255,255,0.1)'
                                                }
                                              }}
                                              variant="outlined"
                                            >
                                              📖 Read More
                                            </Button>
                                          </>
                                        );
                                      })()}
                                    </Typography>
                                  </Box>
                                );
                              });
                            })()}
                          </Box>
                          
                          {/* Action Buttons */}
                          <Box sx={{ 
                            mt: 3, 
                            display: 'flex', 
                            gap: 2, 
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleFeedbackClick(entry.id, 'insightful')}
                              sx={{
                                background: feedbackStates[`${entry.id}-insightful`] 
                                  ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                                  : 'rgba(255,255,255,0.2)',
                                color: feedbackStates[`${entry.id}-insightful`] ? '#000' : 'white',
                                fontWeight: 'bold',
                                border: feedbackStates[`${entry.id}-insightful`] ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                  background: feedbackStates[`${entry.id}-insightful`] 
                                    ? 'linear-gradient(45deg, #FFA500, #FFD700)' 
                                    : 'rgba(255,255,255,0.3)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.3s ease',
                                minWidth: '120px'
                              }}
                            >
                              💡 Insightful
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleFeedbackClick(entry.id, 'actionable')}
                              sx={{
                                background: feedbackStates[`${entry.id}-actionable`] 
                                  ? 'linear-gradient(45deg, #4CAF50, #45a049)' 
                                  : 'rgba(255,255,255,0.2)',
                                color: feedbackStates[`${entry.id}-actionable`] ? '#fff' : 'white',
                                fontWeight: 'bold',
                                border: feedbackStates[`${entry.id}-actionable`] ? '2px solid #4CAF50' : '1px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                  background: feedbackStates[`${entry.id}-actionable`] 
                                    ? 'linear-gradient(45deg, #45a049, #4CAF50)' 
                                    : 'rgba(255,255,255,0.3)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.3s ease',
                                minWidth: '120px'
                              }}
                            >
                              🎯 Actionable
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleFeedbackClick(entry.id, 'helpful')}
                              sx={{
                                background: feedbackStates[`${entry.id}-helpful`] 
                                  ? 'linear-gradient(45deg, #2196F3, #1976D2)' 
                                  : 'rgba(255,255,255,0.2)',
                                color: feedbackStates[`${entry.id}-helpful`] ? '#fff' : 'white',
                                fontWeight: 'bold',
                                border: feedbackStates[`${entry.id}-helpful`] ? '2px solid #2196F3' : '1px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                  background: feedbackStates[`${entry.id}-helpful`] 
                                    ? 'linear-gradient(45deg, #1976D2, #2196F3)' 
                                    : 'rgba(255,255,255,0.3)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.3s ease',
                                minWidth: '120px'
                              }}
                            >
                              🌟 Helpful
                            </Button>
                          </Box>

                          {/* Follow-up Chat Section */}
                          <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
                            <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.3)' }} />
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 2,
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.8 }
                            }}
                            onClick={() => setShowFollowUp(prev => ({ ...prev, [entry.id]: !prev[entry.id] }))}
                            >
                              <Typography variant="h6" sx={{ 
                                color: '#FFD700',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                💬 Ask Follow-up Questions
                                <Box sx={{ ml: 1, transform: showFollowUp[entry.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                                  ▼
                                </Box>
                              </Typography>
                            </Box>

                            {showFollowUp[entry.id] && (
                              <Fade in={showFollowUp[entry.id]}>
                                <Box sx={{ 
                                  background: 'rgba(255,255,255,0.05)',
                                  borderRadius: 3,
                                  p: 3,
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                  {/* Chat History */}
                                  <Box 
                                    ref={el => chatContainerRefs.current[entry.id] = el}
                                    sx={{ 
                                      maxHeight: 300, 
                                      overflowY: 'auto', 
                                      pr: 1,
                                      mb: 2
                                    }}
                                  >
                                    {followUpResponses[entry.id] && followUpResponses[entry.id].map((chat, chatIndex) => {
                                      const responseKey = `${entry.id}-${chatIndex}`;
                                      const isExpanded = expandedResponses[responseKey];
                                      const formattedResponse = formatResponse(chat.response);
                                      const displayResponse = isExpanded ? formattedResponse : truncateResponse(formattedResponse);
                                      
                                      return (
                                        <Box key={chatIndex} sx={{ mb: 3 }}>
                                          {/* Question */}
                                          <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            mb: 1.5,
                                            gap: 1.5
                                          }}>
                                            <Avatar sx={{ 
                                              width: 32, 
                                              height: 32, 
                                              background: '#FF6B9D',
                                              fontSize: '0.8rem'
                                            }}>
                                              You
                                            </Avatar>
                                            <Box sx={{ 
                                              background: 'rgba(255,107,157,0.2)',
                                              borderRadius: 2,
                                              p: 2,
                                              flex: 1,
                                              border: '1px solid rgba(255,107,157,0.3)'
                                            }}>
                                              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                                                {chat.question}
                                              </Typography>
                                            </Box>
                                          </Box>
                                          
                                          {/* Answer */}
                                          <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start',
                                            gap: 1.5
                                          }}>
                                            <Avatar sx={{ 
                                              width: 32, 
                                              height: 32, 
                                              background: '#4ECDC4',
                                              fontSize: '0.8rem'
                                            }}>
                                              AI
                                            </Avatar>
                                            <Box sx={{ 
                                              background: 'rgba(78,205,196,0.2)',
                                              borderRadius: 2,
                                              p: 2,
                                              flex: 1,
                                              border: '1px solid rgba(78,205,196,0.3)'
                                            }}>
                                              <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                  color: 'white', 
                                                  lineHeight: 1.6,
                                                  whiteSpace: 'pre-line',
                                                  mb: formattedResponse.length > 200 ? 1 : 0
                                                }}
                                              >
                                                {displayResponse}
                                              </Typography>
                                              
                                              {formattedResponse.length > 200 && (
                                                <Button
                                                  size="small"
                                                  onClick={() => setExpandedResponses(prev => ({
                                                    ...prev,
                                                    [responseKey]: !isExpanded
                                                  }))}
                                                  sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: '0.75rem',
                                                    p: 0,
                                                    minWidth: 'auto',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                      background: 'rgba(255,255,255,0.1)'
                                                    }
                                                  }}
                                                >
                                                  {isExpanded ? 'Show less' : 'Read more...'}
                                                </Button>
                                              )}
                                              
                                              <Typography variant="caption" sx={{ 
                                                color: 'rgba(255,255,255,0.6)', 
                                                display: 'block',
                                                mt: 1
                                              }}>
                                                {new Date(chat.timestamp).toLocaleTimeString()}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </Box>
                                      );
                                    })}
                                  </Box>

                                  {/* Chat Input */}
                                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      placeholder="Ask a follow-up question about this insight..."
                                      value={followUpQuestion[entry.id] || ''}
                                      onChange={(e) => setFollowUpQuestion(prev => ({ ...prev, [entry.id]: e.target.value }))}
                                      onKeyPress={(e) => e.key === 'Enter' && sendFollowUpQuestion(entry.id)}
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          color: 'white',
                                          '& fieldset': {
                                            borderColor: 'rgba(255,255,255,0.3)',
                                          },
                                          '&:hover fieldset': {
                                            borderColor: 'rgba(255,255,255,0.5)',
                                          },
                                          '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700',
                                          },
                                        },
                                        '& .MuiInputLabel-root': {
                                          color: 'rgba(255,255,255,0.7)',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                          color: 'rgba(255,255,255,0.5)',
                                          opacity: 1,
                                        },
                                      }}
                                    />
                                    <Button
                                      variant="contained"
                                      onClick={() => sendFollowUpQuestion(entry.id)}
                                      disabled={followUpLoading[entry.id] || !followUpQuestion[entry.id]?.trim()}
                                      sx={{
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        minWidth: 100,
                                        '&:hover': {
                                          background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                                        },
                                        '&:disabled': {
                                          background: 'rgba(255,255,255,0.2)',
                                          color: 'rgba(255,255,255,0.5)',
                                        }
                                      }}
                                    >
                                      {followUpLoading[entry.id] ? (
                                        <CircularProgress size={20} color="inherit" />
                                      ) : (
                                        'Send'
                                      )}
                                    </Button>
                                  </Box>
                                </Box>
                              </Fade>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        {/* Eye icon removed - redundant with "Get AI Insights" button */}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Capability Assessment Popup */}
        {showCapabilityAssessment && capabilityScore && (
          <Dialog
            open={showCapabilityAssessment}
            onClose={() => setShowCapabilityAssessment(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box display="flex" alignItems="center">
                <BarChart sx={{ mr: 1 }} />
                📊 Your Problem-Solving Capability
              </Box>
              <IconButton 
                onClick={() => setShowCapabilityAssessment(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  {capabilityScore}/10
                </Typography>
                
                <Typography variant="h6" color="text.secondary" mb={2}>
                  {capabilityScore >= 8 ? '🌟 Excellent! You\'re very capable of handling this!' :
                   capabilityScore >= 6 ? '👍 Good! You have solid problem-solving skills!' :
                   capabilityScore >= 4 ? '💪 Fair! You can handle this with some support!' :
                   '💪 You\'re developing your skills! Every challenge makes you stronger!'}
                </Typography>
                
                {/* Debug Info - Show the calculation */}
                <Box sx={{ 
                  background: '#f5f5f5', 
                  p: 2, 
                  borderRadius: 2, 
                  mt: 2,
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    🔍 How This Score Was Calculated:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • Analyzed your past journal entries with similar emotions/challenges
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • Calculated your success rate in handling similar situations
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • Identified your most effective coping strategies
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • Considered emotional intensity and personal patterns
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    💡 Higher score = Higher capability to handle this type of challenge
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}

        {/* Quick Personalized Advice Popup */}
        {quickAdvice.show && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              animation: 'fadeIn 0.3s ease-in-out'
            }}
            onClick={() => setQuickAdvice({ show: false, strategies: [], entryId: null })}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                borderRadius: 4,
                p: 4,
                maxWidth: 500,
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                animation: 'slideIn 0.3s ease-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease'
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <IconButton
                onClick={() => setQuickAdvice({ show: false, strategies: [], entryId: null })}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                ✕
              </IconButton>

              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  💡 Quick Personalized Advice
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                  Based on your past experiences, try these strategies:
                </Typography>
              </Box>

              {/* Strategies Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                {quickAdvice.strategies.map((strategy, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.25)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {strategy}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, mb: 2 }}>
                  💝 These suggestions are based on what helped you feel better in the past!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setQuickAdvice({ show: false, strategies: [], entryId: null })}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Got it!
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Read More Popup */}
        {readMoreContent.open && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              p: 2
            }}
            onClick={() => setReadMoreContent({ open: false, title: '', content: '' })}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 4,
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <IconButton
                onClick={() => setReadMoreContent({ open: false, title: '', content: '' })}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                ✕
              </IconButton>

              {/* Title */}
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3, pr: 6 }}>
                {readMoreContent.title}
              </Typography>

              {/* Content */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white',
                  lineHeight: 1.8,
                  fontSize: '1rem',
                  whiteSpace: 'pre-line'
                }}
              >
                {readMoreContent.content}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Add CSS animations */}
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { 
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
              }
              to { 
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default Journal; 
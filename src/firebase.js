// src/firebase.js
import axios from 'axios';

const apiUrl = 'http://localhost:3001'; // Update with your backend URL

const firebaseApi = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (email, password) => {
  try {
    const response = await firebaseApi.post('/register', { email, password });
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response.data.error);
    throw error.response.data;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await firebaseApi.post('/login', { email, password });
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response.data.error);
    throw error.response.data;
  }
};

export const sendMessage = async (senderId, receiverId, text) => {
  try {
    const response = await firebaseApi.post('/sendMessage', { senderId, receiverId, text });
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response.data.error);
    throw error.response.data;
  }
};

export const fetchMessages = async (userId) => {
  try {
    const response = await firebaseApi.get('/fetchMessages', { params: { userId } });
    console.log('Messages fetched successfully');
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages:', error.response.data.error);
    throw error.response.data;
  }
};

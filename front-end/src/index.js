import React from 'react';
import ReactDOM from 'react-dom/client';
import Routing from './routing';
import './index.css';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';


const setupAxios = async () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true;
};


setupAxios().then(() => {
  // Set up axios interceptor to include token in all requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Routing />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});
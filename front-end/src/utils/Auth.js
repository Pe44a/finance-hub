import axios from 'axios';

export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/login', { email, password });
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  } catch (error) {
    console.error('Login failed', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await axios.post('/api/logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axios.get('/api/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Auth check failed', error);
    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
    return false;
  }
};
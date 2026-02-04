import { jwtDecode } from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'workflow_token';
const REFRESH_TOKEN_KEY = 'workflow_refresh_token';
const USER_DATA_KEY = 'workflow_user_data';

// Token management
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// User data management
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const updateUserData = (updates) => {
  const currentData = getUserData();
  if (currentData) {
    setUserData({ ...currentData, ...updates });
  }
};

// Token validation
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      removeToken();
      return false;
    }
    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

export const getTokenExpiration = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp;
  } catch (error) {
    return null;
  }
};

export const getTokenTimeLeft = () => {
  const exp = getTokenExpiration();
  if (!exp) return 0;

  const currentTime = Date.now() / 1000;
  return exp - currentTime;
};

// User roles and permissions
export const getUserRole = () => {
  const userData = getUserData();
  return userData?.role || 'worker';
};

export const hasPermission = (requiredPermission) => {
  const userData = getUserData();
  const userPermissions = userData?.permissions || [];
  return userPermissions.includes(requiredPermission) || userPermissions.includes('admin');
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole || userRole === 'admin';
};

export const getAvailableRoles = () => {
  const userRole = getUserRole();
  
  const allRoles = {
    admin: ['admin', 'manager', 'approver', 'worker'],
    manager: ['manager', 'approver', 'worker'],
    approver: ['approver', 'worker'],
    worker: ['worker']
  };

  return allRoles[userRole] || ['worker'];
};

// Auth state management
export const isAuthenticated = () => {
  return isTokenValid() && !!getUserData();
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

// Login helper
export const handleLoginSuccess = ({ token, refreshToken, user }) => {
  setToken(token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  setUserData(user);
  return user;
};

// Protected route helper
export const requireAuth = (nextState, replace) => {
  if (!isAuthenticated()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

// Guest route helper
export const requireGuest = (nextState, replace) => {
  if (isAuthenticated()) {
    replace('/dashboard');
  }
};

// Auth initialization
export const initializeAuth = () => {
  if (isTokenValid()) {
    const token = getToken();
    const userData = getUserData();
    return { token, userData };
  }
  return null;
};
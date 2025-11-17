import { createSlice } from '@reduxjs/toolkit';

console.log('--- authSlice.js is running (Top Level) ---');

const token = localStorage.getItem('token');
let user = null;
try {
  user = JSON.parse(localStorage.getItem('user'));
  console.log('Data loaded from localStorage:', { token, user });
} catch (e) {
  console.error("Could not parse user from localStorage", e);
  localStorage.removeItem('user');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: user || null,
    role: user?.role || 'guest',
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log('--- Reducer: loginSuccess ---');
      console.log('Payload received:', action.payload);
      const { token, username, role } = action.payload;
      const normalizedRole = (role || 'guest').toLowerCase();
      const userObject = { name: username, role: normalizedRole };
      
      state.token = token;
      state.user = userObject;
      state.role = normalizedRole;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObject));
      console.log('State updated and localStorage set:', { token, user: userObject });
    },
    logout: (state) => {
      console.log('--- Reducer: logout ---');
      state.token = null;
      state.user = null;
      state.role = 'guest';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './Loader';

export default function RoleRoute({ roles = [], children }) {
  const { role, token, user } = useSelector(state => state.auth);
  const location = useLocation();

  // THE DEFINITIVE FIX: Check localStorage directly to win the race condition.
  const storedToken = localStorage.getItem('token');

  if (!storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (storedToken && !user) {
    // We have a token, but the user object isn't in Redux yet. Wait for it.
    return <Loader />;
  }

  // --- THE CASE-SENSITIVITY FIX IS HERE ---
  // Convert the user's role and the required roles to lowercase for a reliable comparison.
  const userRole = role.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (!allowedRoles.includes(userRole)) {
    // Now, this check will work correctly: !['admin'].includes('admin') will be FALSE.
    return <Navigate to="/" replace />; // Redirect to user dashboard if role is wrong
  }

  // If all checks pass, render the protected component.
  return children;
}
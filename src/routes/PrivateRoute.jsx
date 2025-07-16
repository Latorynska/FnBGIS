import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadUserData } from '../redux/thunks/authApi';
import { useEffect, useState } from 'react';
import LoadingScreen from '../pages/LoadingScreen/LoadingScreen';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && auth.currentUser) {
        try {
          await dispatch(loadUserData(auth.currentUser.uid));
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  // Delay hide loading screen for animation exit
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setShowLoading(false), 400); // allow exit animation
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (showLoading) {
    return <LoadingScreen isVisible={showLoading} />;
  }

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

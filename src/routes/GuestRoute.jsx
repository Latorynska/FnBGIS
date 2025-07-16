import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadUserData } from '../redux/thunks/authApi';
import { useEffect, useState } from 'react';
import LoadingScreen from '../pages/LoadingScreen/LoadingScreen';

const GuestRoute = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const loading = useSelector((state) => state.auth.loading);
  const userData = useSelector((state) => state.auth.userData);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser && !userData) {
        dispatch(loadUserData(auth.currentUser.uid));
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch, userData]);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 400); // waktu tunggu animasi keluar
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (showLoading) {
    return <LoadingScreen isVisible={showLoading} />;
  }

  if (auth.currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default GuestRoute;

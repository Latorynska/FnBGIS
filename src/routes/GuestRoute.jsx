import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadUserData } from '../redux/thunks/authApi';
import { useEffect, useState } from 'react';

const GuestRoute = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const loading = useSelector((state) => state.auth.loading);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (auth.currentUser !== null && !userData) {
          dispatch(loadUserData(auth.currentUser.uid));
        }
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch, userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (auth.currentUser) {
    return <Navigate to={'/Dashboard'} />;
  }

  return <Outlet />;
};

export default GuestRoute;
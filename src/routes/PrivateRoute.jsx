import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadUserData } from '../redux/thunks/authApi';
import { useEffect, useState } from 'react';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (auth.currentUser !== null) {
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
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  
  if (!userData && !auth.currentUser) {
    // Handle the case where userData is not yet available.
    return <div>Loading user data...</div>;
  }
  if (!auth.currentUser) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
};

export default PrivateRoute;

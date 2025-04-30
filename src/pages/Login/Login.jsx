import React, { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';
const Login = () => {
  useEffect(() => {
    const markers = document.querySelectorAll('.map-marker');

    markers.forEach((marker, index) => {
      setTimeout(() => {
        marker.style.opacity = '1';
        marker.style.transform = 'translateY(-10px)';

        setInterval(() => {
          marker.style.transform = 'translateY(-10px) scale(1.2)';
          setTimeout(() => {
            marker.style.transform = 'translateY(-10px) scale(1)';
          }, 500);
        }, 3000 + index * 1000);
      }, index * 300);
    });

    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.parentElement.querySelector('i').style.color = '#10B981';
      });
      input.addEventListener('blur', () => {
        input.parentElement.querySelector('i').style.color = '#9CA3AF';
      });
    });
  }, []);

  return (
    <div className="text-white flex items-center justify-center p-4 min-h-screen relative overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #111827 0%, #1e293b 100%)' }}>
      <div className="bg-pattern absolute w-full h-full z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(74, 222, 128, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 90% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 30% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 20%)`
      }}></div>

      {/* Map Markers */}
      <div className="absolute inset-0 z-10">
        <div className="map-marker absolute text-red-500 text-2xl" style={{ top: '25%', left: '30%', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }}>
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div className="map-marker absolute text-red-500 text-2xl" style={{ top: '40%', right: '25%', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }}>
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div className="map-marker absolute text-red-500 text-2xl" style={{ bottom: '30%', left: '40%', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }}>
          <i className="fas fa-map-marker-alt"></i>
        </div>
      </div>

      {/* Login Container */}
      <div className="login-container relative w-full max-w-md p-8 z-20" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <i className="fas fa-map-marked-alt text-white text-2xl"></i>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">FnBGIS</h1>
          <p className="text-gray-300">FnB's Performance Mapping Platform</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input id="email" name="email" type="email" required placeholder="you@example.com"
                className="input-field pl-10 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400"
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input id="password" name="password" type="password" required placeholder="••••••••"
                className="input-field pl-10 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400"
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">Forgot password?</a>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <i className="fas fa-sign-in-alt mr-2"></i> Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <a href="#" className="w-full inline-flex justify-center py-2 px-4 rounded-lg input-field hover:bg-gray-800">
              <i className="fab fa-google text-red-500 text-xl"></i>
            </a>
            <a href="#" className="w-full inline-flex justify-center py-2 px-4 rounded-lg input-field hover:bg-gray-800">
              <i className="fab fa-facebook-f text-blue-500 text-xl"></i>
            </a>
            <a href="#" className="w-full inline-flex justify-center py-2 px-4 rounded-lg input-field hover:bg-gray-800">
              <i className="fab fa-github text-gray-300 text-xl"></i>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
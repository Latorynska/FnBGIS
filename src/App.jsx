import { useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GuestRoute from '../src/routes/GuestRoute';
import PrivateRoute from '../src/routes/PrivateRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './layouts/Layout'
import ManageBranchArea from './pages/ManageBranchArea/ManageBranchArea'
import ManageBranchData from './pages/ManageBranchData/ManageBranchData'
import ManageBrandInformation from './pages/ManageBrandInformation/ManageBrandInformation'
import NotFound from './pages/NotFound/NotFound'
import MapMetadata from './pages/MapMetadata/MapMetadata'
import Logout from './pages/Logout/Logout'
import { Toaster } from 'react-hot-toast';
import KelolaPengguna from './pages/KelolaPengguna/KelolaPengguna'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1E1F2B',
              color: '#F3F4F6',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#1E2C20',
                borderLeft: '4px solid #00FF7F',
                color: '#C6F6D5'
              },
              iconTheme: {
                primary: '#00FF7F',
                secondary: '#1E1F2B'
              }
            },
            error: {
              style: {
                background: '#2C1E1E',
                borderLeft: '4px solid #FF5555',
                color: '#FECACA'
              },
              iconTheme: {
                primary: '#FF5555',
                secondary: '#2C1E1E'
              }
            },
            loading: {
              style: {
                background: '#1E2B33',
                borderLeft: '4px solid #3B82F6',
                color: '#BFDBFE'
              }
            }
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/manage-branch-area' element={<ManageBranchArea />} />
                <Route path='/manage-branch-data' element={<ManageBranchData />} />
                <Route path='/manage-brand-information' element={<ManageBrandInformation />} />
                <Route path='/manage-map-metadata' element={<MapMetadata />} />
                <Route path='/kelola-pengguna' element={<KelolaPengguna />} />
              </Route>
              <Route path='/logout' element={<Logout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

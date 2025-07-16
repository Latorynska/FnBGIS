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


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path='/' element={ <Login /> } />
              <Route path='/login' element={ <Login /> } />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/manage-branch-area' element={<ManageBranchArea />} />
                <Route path='/manage-branch-data' element={<ManageBranchData />} />
                <Route path='/manage-brand-information' element={<ManageBrandInformation />} />
                <Route path='/manage-map-metadata' element={<MapMetadata />} />
              </Route>
              <Route path='/logout' element={ <Logout /> } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

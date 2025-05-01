import { useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './layouts/Layout'
import ManageBranch from './pages/ManageBranch/ManageBranch'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={ <Login /> } />
            <Route path='/login' element={ <Login /> } />
            <Route element={<Layout />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/manage-branch' element={<ManageBranch />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={ <Login /> } />
            
            <Route path='/login' element={ <Login /> } />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

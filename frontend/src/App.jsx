import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Routes, Route, Navigate} from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import { LoaderCircle } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <LoaderCircle className='size-10 animate-spin' />
    </div>
  )

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />}/>
        <Route path='/settings' element={<SettingsPage />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
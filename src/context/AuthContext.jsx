import { createContext, useContext, useState } from 'react'
import { USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, isAuthenticated: false })
  const [loginError, setLoginError] = useState('')

  function login(email, password) {
    const user = USERS.find(u => u.email === email && u.password === password)
    if (user) {
      setAuth({ user, isAuthenticated: true })
      setLoginError('')
      return true
    }
    setLoginError('Invalid email or password. Please try again.')
    return false
  }

  function logout() {
    setAuth({ user: null, isAuthenticated: false })
    setLoginError('')
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

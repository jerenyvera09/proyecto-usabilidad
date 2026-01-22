import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null
    } catch {
      return null
    }
  })

  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', accessToken)
    } catch (error) {
      console.error('Error guardando sesión:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }

  // Valor booleano derivado (no función) para evitar confusiones
  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

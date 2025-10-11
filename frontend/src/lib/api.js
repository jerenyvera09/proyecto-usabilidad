import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const api = axios.create({ baseURL: API })

// initialize token from localStorage if present
const existing = localStorage.getItem('token')
if(existing){ api.defaults.headers.common['Authorization'] = `Bearer ${existing}` }

export function setToken(token){
  if(token){ api.defaults.headers.common['Authorization'] = `Bearer ${token}`; localStorage.setItem('token', token) }
  else { delete api.defaults.headers.common['Authorization']; localStorage.removeItem('token') }
}

// helper: check token expiration (decode JWT payload without verifying signature)
export function isTokenExpired(token){
  if(!token) return true
  try{
    const parts = token.split('.')
    if(parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if(!payload.exp) return true
    // exp is seconds since epoch
    return (payload.exp * 1000) < Date.now()
  }catch(e){ return true }
}

// Axios response interceptor: on 401 remove token and redirect to demo login (/prediction)
api.interceptors.response.use(
  r => r,
  err => {
    if(err.response && err.response.status === 401){
      try{ setToken(null) }catch(e){}
      // redirect user to demo login route
      if(typeof window !== 'undefined'){
        window.location.href = '/prediction'
      }
    }
    return Promise.reject(err)
  }
)

// Request interceptor: check expiration before sending any request
api.interceptors.request.use(
  config => {
    try{
      const token = localStorage.getItem('token')
      if(token){
        // if expired, force logout and redirect
        if(isTokenExpired(token)){
          try{ setToken(null) }catch(e){}
          if(typeof window !== 'undefined') window.location.href = '/prediction'
          // prevent request
          return Promise.reject(new Error('token_expired'))
        }
      }
    }catch(e){ /* ignore */ }
    return config
  },
  err => Promise.reject(err)
)

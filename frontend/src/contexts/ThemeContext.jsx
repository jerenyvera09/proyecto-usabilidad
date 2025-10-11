import { createContext, useEffect, useState } from 'react'
export const ThemeContext = createContext({ dark:false, setDark: ()=>{} })

export function ThemeProvider({ children }){
  const [dark, setDark] = useState(localStorage.getItem('dark') === '1')
  useEffect(()=>{
    localStorage.setItem('dark', dark ? '1' : '0')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return <ThemeContext.Provider value={{ dark, setDark }}>{children}</ThemeContext.Provider>
}

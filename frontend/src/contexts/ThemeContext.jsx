import { createContext, useEffect, useState } from 'react'
export const ThemeContext = createContext({ dark:false, setDark: ()=>{},
  highContrast:false, setHighContrast: ()=>{}, friendlyFont:false, setFriendlyFont: ()=>{}, readingComfort:false, setReadingComfort: ()=>{}, textSize: 'normal', setTextSize: ()=>{} })

export function ThemeProvider({ children }){
  const [dark, setDark] = useState(localStorage.getItem('dark') === '1')
  const [highContrast, setHighContrast] = useState(localStorage.getItem('highContrast') === '1')
  const [friendlyFont, setFriendlyFont] = useState(localStorage.getItem('friendlyFont') === '1')
  const [readingComfort, setReadingComfort] = useState(localStorage.getItem('readingComfort') === '1')
  const [textSize, setTextSize] = useState(localStorage.getItem('textSize') || 'normal')

  useEffect(()=>{
    localStorage.setItem('dark', dark ? '1' : '0')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(()=>{
    localStorage.setItem('highContrast', highContrast ? '1' : '0')
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  useEffect(()=>{
    localStorage.setItem('friendlyFont', friendlyFont ? '1' : '0')
    document.documentElement.classList.toggle('font-friendly', friendlyFont)
  }, [friendlyFont])

  useEffect(()=>{
    localStorage.setItem('readingComfort', readingComfort ? '1' : '0')
    document.documentElement.classList.toggle('reading-comfort', readingComfort)
  }, [readingComfort])

  useEffect(()=>{
    localStorage.setItem('textSize', textSize)
    document.documentElement.classList.toggle('text-size-large', textSize === 'large')
  }, [textSize])

  return (
    <ThemeContext.Provider value={{ dark, setDark, highContrast, setHighContrast, friendlyFont, setFriendlyFont, readingComfort, setReadingComfort, textSize, setTextSize }}>
      {children}
    </ThemeContext.Provider>
  )
}

import { createSlice } from '@reduxjs/toolkit'

const prefersDark = (
  localStorage.getItem('theme') === 'dark' ||
  (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', prefersDark)
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode: prefersDark },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode
      const isDark = state.darkMode
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }
  }
})

export const { toggleTheme } = uiSlice.actions
export default uiSlice.reducer

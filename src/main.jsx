import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const savedTheme = localStorage.getItem('theme')
const shouldUseLightTheme =
  savedTheme === 'light' ||
  (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)

if (shouldUseLightTheme) {
  document.documentElement.classList.add('light')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)

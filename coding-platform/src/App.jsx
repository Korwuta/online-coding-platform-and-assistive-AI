import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from "./page/LandingPage/LandingPage.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./page/LoginPage/LoginPage.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path={'/'} Component={LandingPage}/>
          <Route path={'/login'} Component={LoginPage}/>
      </Routes>
    </>
  )
}

export default App

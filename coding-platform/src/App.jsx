import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from "./page/LandingPage/LandingPage.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./page/LoginPage/LoginPage.jsx";
import Reset from "./page/LoginPage/Reset.jsx";
import NewPasswordReset from "./page/LoginPage/NewPasswordReset.jsx";
import LoadingBar from "./LoadingBar.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path={'/'} Component={LandingPage}/>
          <Route path={'/login'} Component={LoginPage}/>
          <Route path={'/reset'} Component={Reset}/>
          <Route path={'/reset/:resetToken'} Component={NewPasswordReset}/>
      </Routes>
    </>
  )
}

export default App

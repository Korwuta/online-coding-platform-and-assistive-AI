import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from "./page/LandingPage/LandingPage.jsx";
import {Route, Routes} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path={'/'} Component={LandingPage}/>
      </Routes>
    </>
  )
}

export default App

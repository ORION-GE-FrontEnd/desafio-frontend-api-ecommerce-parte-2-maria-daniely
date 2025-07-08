import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "../src/components/Login/Login"
import './index.css'

function App() {

  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login/Login"; 
import HomePage from './components/HomePage/HomePage';
import SignUp from './components/SignUp/SignUp';
import './index.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/cadastro" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
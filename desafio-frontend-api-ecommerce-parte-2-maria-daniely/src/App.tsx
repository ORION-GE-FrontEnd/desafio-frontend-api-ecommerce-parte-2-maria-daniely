import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login/Login"; 
import HomePage from './components/HomePage/HomePage';
import SignUp from './components/SignUp/SignUp';
import CartPage from './components/CartPage/CartPage';

import './index.css';
import PaymentForm from './components/PaymentForm/PaymentForm';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/pagamento" element={<PaymentForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
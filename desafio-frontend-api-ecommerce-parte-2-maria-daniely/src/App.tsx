import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AutoProvider/AutoProvider';
import { ProtectedRoute } from '../src/ProtectedRoute/ProtectedRoute';
import Login from "./components/Login/Login"; 
import HomePage from './components/HomePage/HomePage';
import SignUp from './components/SignUp/SignUp';
import CartPage from './components/CartPage/CartPage';
import './index.css';
import PaymentForm from './components/PaymentForm/PaymentForm';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/cadastro" element={<SignUp />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/carrinho"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamento"
            element={
              <ProtectedRoute>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
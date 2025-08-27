import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/context/useAuth';
import type { JSX } from 'react/jsx-runtime';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/*
Proteção da pagina HomePage;
- trata-se de se o usuario está logado ou não
*/
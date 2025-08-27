import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AutoProvider/AutoProvider';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';
import Login from "./components/Login/Login";
import HomePage from './components/HomePage/HomePage';
import SignUp from './components/SignUp/SignUp';
import CartPage from './components/CartPage/CartPage';
import './index.css';
import PaymentForm from './components/PaymentForm/PaymentForm';
import OrderSummary from './components/OrderSummary/OrderSummary';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

//BFF GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', 
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
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

            <Route
              path="/resumo-pedido" 
              element={ 
                <ProtectedRoute> 
                  <OrderSummary /> 
                </ProtectedRoute> 
              } 
            /> 

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
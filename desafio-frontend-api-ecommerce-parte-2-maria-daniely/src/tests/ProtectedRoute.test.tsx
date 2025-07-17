import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';

jest.mock('../components/context/useAuth', () => ({
    useAuth: jest.fn()
}));

import { useAuth } from '../components/context/useAuth';

const mockedUseAuth = useAuth as jest.Mock;

describe('ProtectedRoute', () => {
    const MockedComponent = () => <div>Área Protegida</div>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('redireciona para /login quando não autenticado', () => {
        mockedUseAuth.mockReturnValue({ isAuthenticated: false});
    
        render(
            <MemoryRouter initialEntries={['/']}>
                <ProtectedRoute>
                    <MockedComponent />
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.queryByText('Área Protegida')).not.toBeInTheDocument();
    });
});
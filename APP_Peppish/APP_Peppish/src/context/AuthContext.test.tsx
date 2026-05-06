import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './AuthContext';
import { useAuth } from './AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access auth context
const TestComponent = () => {
  const { user, token, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-data">{user?.email || 'Not authenticated'}</div>
      <div data-testid="token-data">{token || 'No token'}</div>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
};

const queryClient = new QueryClient();

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    queryClient.clear();
  });

  it('should provide default auth state when no token in localStorage', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('user-data')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('token-data')).toHaveTextContent('No token');
  });

  it('should restore user and token from localStorage on mount', async () => {
    const testUser = { id: '1', email: 'test@example.com', role: 'adult' };
    const testToken = 'test-jwt-token';

    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('token', testToken);

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent(testUser.email);
      expect(screen.getByTestId('token-data')).toHaveTextContent(testToken);
    });
  });

  it('should provide useAuth hook to access auth state', async () => {
    const testUser = { id: '1', email: 'test@example.com', role: 'adult' };
    const testToken = 'test-jwt-token';

    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('token', testToken);

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent(testUser.email);
    });
  });
});

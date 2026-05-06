import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import ChoreListPage from './ChoreListPage';
import AuthProvider from '../context/AuthContext';

// Mock the useChores hook
jest.mock('../hooks/useChores', () => ({
  __esModule: true,
  default: () => ({
    data: [
      {
        id: '1',
        title: 'Clean room',
        status: 'available',
        assignedTo: null,
        createdAt: new Date().toISOString(),
        description: 'Clean your room',
        uiStatus: 'Pending'
      },
      {
        id: '2',
        title: 'Wash dishes',
        status: 'assigned',
        assignedTo: 'user-1',
        createdAt: new Date().toISOString(),
        description: 'Wash all dishes',
        uiStatus: 'Pending'
      },
      {
        id: '3',
        title: 'Vacuum',
        status: 'completed',
        assignedTo: 'user-1',
        createdAt: new Date().toISOString(),
        description: 'Vacuum all rooms',
        uiStatus: 'Completed'
      }
    ],
    isLoading: false,
    isError: false,
  }),
}));

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com', role: 'adult' },
    token: 'test-token',
    logout: jest.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ChoreListPage', () => {
  it('should render chore list', async () => {
    renderWithProviders(<ChoreListPage />);

    await waitFor(() => {
      expect(screen.getByText(/clean room/i)).toBeInTheDocument();
      expect(screen.getByText(/wash dishes/i)).toBeInTheDocument();
      expect(screen.getByText(/vacuum/i)).toBeInTheDocument();
    });
  });

  it('should display week view heading', () => {
    renderWithProviders(<ChoreListPage />);

    expect(screen.getByText(/week/i)).toBeInTheDocument();
  });

  it('should display chore cards with descriptions', async () => {
    renderWithProviders(<ChoreListPage />);

    await waitFor(() => {
      expect(screen.getByText(/clean your room/i)).toBeInTheDocument();
      expect(screen.getByText(/wash all dishes/i)).toBeInTheDocument();
    });
  });

  it('should display status badges for chores', async () => {
    renderWithProviders(<ChoreListPage />);

    await waitFor(() => {
      // Check for status text
      const pageText = screen.getByText(/Pending|Completed/);
      expect(pageText).toBeInTheDocument();
    });
  });
});

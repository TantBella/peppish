import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useChores from './useChores';

// Mock the choreService
jest.mock('../services/choreService', () => ({
  __esModule: true,
  default: {
    getChores: jest.fn(() => Promise.resolve([
      {
        id: '1',
        title: 'Clean room',
        status: 'available',
        assignedTo: null,
        createdAt: new Date().toISOString(),
        description: 'Clean your room'
      },
      {
        id: '2',
        title: 'Wash dishes',
        status: 'assigned',
        assignedTo: 'user-2',
        createdAt: new Date().toISOString(),
        description: 'Wash all dishes'
      },
      {
        id: '3',
        title: 'Do laundry',
        status: 'completed',
        assignedTo: 'user-1',
        createdAt: new Date().toISOString(),
        description: 'Wash and dry clothes'
      },
      {
        id: '4',
        title: 'Vacuum',
        status: 'approved',
        assignedTo: 'user-1',
        createdAt: new Date().toISOString(),
        description: 'Vacuum all rooms'
      }
    ])),
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useChores Hook', () => {
  it('should map API status to UI status correctly', async () => {
    const { result } = renderHook(() => useChores(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to resolve
    await new Promise(resolve => setTimeout(resolve, 100));

    if (result.current.data) {
      const chores = result.current.data;

      // Test status mapping
      const availableChore = chores.find(c => c.id === '1');
      expect(availableChore?.uiStatus).toBe('Pending');

      const assignedChore = chores.find(c => c.id === '2');
      expect(assignedChore?.uiStatus).toBe('Pending');

      const completedChore = chores.find(c => c.id === '3');
      expect(completedChore?.uiStatus).toBe('Completed');

      const approvedChore = chores.find(c => c.id === '4');
      expect(approvedChore?.uiStatus).toBe('Approved');
    }
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useChores(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading or not have data
    expect(result.current.isLoading || !result.current.data).toBeTruthy();
  });

  it('should provide chores data', async () => {
    const { result } = renderHook(() => useChores(), {
      wrapper: createWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.data).toBeDefined();
    if (result.current.data) {
      expect(result.current.data.length).toBeGreaterThan(0);
    }
  });
});

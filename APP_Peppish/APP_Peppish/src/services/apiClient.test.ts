import axios, { AxiosInstance } from 'axios';
import { apiClient } from './apiClient';

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

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should create axios instance with correct base URL', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.baseURL).toBe(process.env.REACT_APP_API_URL);
  });

  it('should be an axios instance', () => {
    expect(axios.isAxiosError).toBeDefined();
    expect(apiClient.get).toBeDefined();
    expect(apiClient.post).toBeDefined();
    expect(apiClient.put).toBeDefined();
    expect(apiClient.delete).toBeDefined();
  });

  it('should have request and response interceptors', () => {
    const interceptors = apiClient.interceptors;
    expect(interceptors.request).toBeDefined();
    expect(interceptors.response).toBeDefined();
  });

  it('should add authorization header with bearer token from localStorage', async () => {
    const testToken = 'test-jwt-token';
    localStorage.setItem('token', testToken);

    // Create a spy on the request interceptor
    let capturedConfig: any = null;
    const originalAdapter = apiClient.defaults.adapter;

    apiClient.defaults.adapter = async (config: any) => {
      capturedConfig = config;
      return { status: 200, data: {} } as any;
    };

    try {
      await apiClient.get('/test');
      expect(capturedConfig?.headers?.Authorization).toBe(`Bearer ${testToken}`);
    } finally {
      apiClient.defaults.adapter = originalAdapter;
    }
  });

  it('should handle requests without token in localStorage', async () => {
    localStorage.removeItem('token');

    let capturedConfig: any = null;
    const originalAdapter = apiClient.defaults.adapter;

    apiClient.defaults.adapter = async (config: any) => {
      capturedConfig = config;
      return { status: 200, data: {} } as any;
    };

    try {
      await apiClient.get('/test');
      // Authorization header should be undefined or empty when no token
      expect(capturedConfig?.headers?.Authorization).not.toBeDefined();
    } finally {
      apiClient.defaults.adapter = originalAdapter;
    }
  });
});

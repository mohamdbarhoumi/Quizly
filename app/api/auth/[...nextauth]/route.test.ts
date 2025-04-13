import { GET, POST } from './route';
import NextAuth from 'next-auth';

// Mock NextAuth
jest.mock('next-auth', () => {
  const mockNextAuthHandler = {
    GET: jest.fn(),
    POST: jest.fn()
  };
  const mockNextAuth = jest.fn(() => mockNextAuthHandler);
  return mockNextAuth;
});

// Mock authOptions
jest.mock('@/lib/nextauth', () => ({
  authOptions: {
    providers: ['google'],
    callbacks: {}
  }
}));

describe('NextAuth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should export NextAuth handlers', () => {
    // Verify that GET and POST are defined
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
    
    // Verify they're the same handler
    expect(GET).toBe(POST);
  });
});
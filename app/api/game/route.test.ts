import { POST, GET } from './route';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Mock dependencies
jest.mock('@/lib/db', () => {
  const mockPrisma = {
    game: {
      create: jest.fn(),
      findUnique: jest.fn()
    },
    topicCount: {
      upsert: jest.fn()
    },
    question: {
      createMany: jest.fn()
    },
    $transaction: jest.fn()
  };
  
  return {
    prisma: mockPrisma
  };
});

jest.mock('@/lib/nextauth', () => ({
  getAuthSession: jest.fn()
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockReturnValue({})
  }
}));

jest.mock('@/schemas/form/quiz', () => ({
  quizCreationSchema: {
    parse: jest.fn(data => data)
  }
}));

jest.mock('axios', () => ({
  post: jest.fn()
}));

// Suppress console.error during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Import after mocking
const { prisma } = require('@/lib/db');
const { getAuthSession } = require('@/lib/nextauth');
const axios = require('axios');
const { quizCreationSchema } = require('@/schemas/form/quiz');

describe('Quiz API', () => {
  const mockPostReq = {
    json: jest.fn().mockResolvedValue({
      topic: 'JavaScript',
      type: 'mcq',
      amount: 5
    })
  };

  const mockGetReq = {
    url: 'http://localhost:3000/api/game?gameId=123'
  };

  const mockSession = {
    user: {
      id: 'user123'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getAuthSession.mockResolvedValue(mockSession);
  });

  describe('POST handler', () => {
    test('should return 401 when user is not authenticated', async () => {
      getAuthSession.mockResolvedValueOnce(null);
      
      await POST(mockPostReq as any);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    });

    test('should return 400 when amount is invalid', async () => {
      mockPostReq.json.mockResolvedValueOnce({
        topic: 'JavaScript',
        type: 'mcq',
        amount: 11
      });
      
      await POST(mockPostReq as any);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Amount must be between 1 and 10" },
        { status: 400 }
      );
    });

    test('should handle MCQ questions creation successfully', async () => {
      const mockGameId = 'game123';
      
      // Setup successful transaction
      prisma.$transaction.mockImplementationOnce(async (callback: any) => {
        return mockGameId;
      });
      
      await POST(mockPostReq as any);
      
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(
        { gameId: mockGameId },
        { status: 200 }
      );
    });

    test('should handle open-ended questions creation successfully', async () => {
      mockPostReq.json.mockResolvedValueOnce({
        topic: 'JavaScript',
        type: 'open_ended',
        amount: 3
      });
      
      const mockGameId = 'game456';
      
      // Setup successful transaction
      prisma.$transaction.mockImplementationOnce(async () => {
        return mockGameId;
      });
      
      await POST(mockPostReq as any);
      
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(
        { gameId: mockGameId },
        { status: 200 }
      );
    });

    test('should handle transaction errors', async () => {
      // Simulate transaction error
      prisma.$transaction.mockRejectedValueOnce(new Error('Transaction failed'));
      
      await POST(mockPostReq as any);
      
      // Verify console.error was called
      expect(console.error).toHaveBeenCalled();
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Question generation took too long. Please try fewer questions.' },
        { status: 500 }
      );
    });

    test('should handle Zod validation errors', async () => {
      const zodError = new ZodError([{
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['topic'],
        message: 'Expected string, received number'
      }]);
      
      // Simulate Zod validation error
      quizCreationSchema.parse.mockImplementationOnce(() => {
        throw zodError;
      });
      
      await POST(mockPostReq as any);
      
      // Verify console.error was called
      expect(console.error).toHaveBeenCalled();
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: zodError.issues },
        { status: 400 }
      );
    });
  });

  describe('GET handler', () => {
    test('should return 401 when user is not authenticated', async () => {
      getAuthSession.mockResolvedValueOnce(null);
      
      await GET(mockGetReq as any);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "You must be logged in to view a game." },
        { status: 401 }
      );
    });

    test('should return 400 when gameId is not provided', async () => {
      await GET({ url: 'http://localhost:3000/api/game' } as any);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "You must provide a game id." },
        { status: 400 }
      );
    });

    test('should return 404 when game not found', async () => {
      prisma.game.findUnique.mockResolvedValueOnce(null);
      
      await GET(mockGetReq as any);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Game not found." },
        { status: 404 }
      );
    });

    test('should return game data when found', async () => {
      const mockGame = {
        id: '123',
        topic: 'JavaScript',
        gametype: 'mcq',
        questions: [
          {
            id: 'q1',
            question: 'What is JavaScript?',
            answer: 'A programming language'
          }
        ]
      };
      
      prisma.game.findUnique.mockResolvedValueOnce(mockGame);
      
      await GET(mockGetReq as any);
      
      expect(prisma.game.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: { questions: true }
      });
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { game: mockGame },
        { status: 200 }
      );
    });

    test('should handle unexpected errors in GET handler', async () => {
      const error = new Error('Unexpected database error');
      prisma.game.findUnique.mockRejectedValueOnce(error);
      
      await GET(mockGetReq as any);
      
      expect(console.error).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    });
  });
});
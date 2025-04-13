import { POST } from './route';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    question: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockReturnValue({})
  }
}));

jest.mock('@/schemas/form/quiz', () => ({
  checkAnswerSchema: {
    parse: jest.fn(data => data)
  }
}));

jest.mock('string-similarity', () => ({
  compareTwoStrings: jest.fn().mockReturnValue(0.8)
}));

// Import after mocking
const { prisma } = require('@/lib/db');

describe('checkAnswer API', () => {
  const mockReq = {
    json: jest.fn().mockResolvedValue({
      questionId: 1,
      userInput: 'test'
    })
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 404 when question not found', async () => {
    // Explicitly provide the implementation for this test
    (prisma.question.findUnique as jest.Mock).mockImplementation(() => null);
    
    await POST(mockReq as any, {} as any);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Question not found" },
      { status: 404 }
    );
  });

  test('should handle MCQ question', async () => {
    // Explicitly provide the implementation for this test
    (prisma.question.findUnique as jest.Mock).mockImplementation(() => ({
      id: 1,
      questionType: 'mcq',
      answer: 'test'
    }));
    
    await POST(mockReq as any, {} as any);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ isCorrect: true });
  });
});
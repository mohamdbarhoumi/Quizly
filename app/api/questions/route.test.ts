import { POST } from './route';
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Mock dependencies
jest.mock("@/lib/gpt", () => ({
  strict_output: jest.fn()
}));

jest.mock("@/lib/nextauth", () => ({
  getAuthSession: jest.fn()
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockReturnValue({})
  }
}));

jest.mock("@/schemas/form/quiz", () => ({
  quizCreationSchema: {
    parse: jest.fn(data => data)
  }
}));

// Suppress console.error during tests if your code uses it
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Import after mocking
const { strict_output } = require('@/lib/gpt');
const { getAuthSession } = require('@/lib/nextauth');
const { quizCreationSchema } = require('@/schemas/form/quiz');

describe('Questions API', () => {
  const mockReq = {
    json: jest.fn()
  };

  const mockSession = {
    user: {
      id: 'user123'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.json.mockResolvedValue({
      topic: 'JavaScript',
      type: 'mcq',
      amount: 3
    });
    getAuthSession.mockResolvedValue(mockSession);
  });

  test('should generate MCQ questions when type is mcq', async () => {
    const mockMcqQuestions = [
      {
        question: "What is JavaScript?",
        answer: "A programming language",
        option1: "A database",
        option2: "A framework",
        option3: "A design pattern"
      },
      {
        question: "What is a closure in JavaScript?",
        answer: "Function with access to parent scope",
        option1: "A way to close a function",
        option2: "A design pattern",
        option3: "A JavaScript feature"
      },
      {
        question: "What is hoisting in JavaScript?",
        answer: "Variables and functions moved to top",
        option1: "Lifting elements up",
        option2: "A browser feature",
        option3: "A performance optimization"
      }
    ];

    strict_output.mockResolvedValueOnce(mockMcqQuestions);
    
    await POST(mockReq as any);
    
    expect(strict_output).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.stringContaining('JavaScript')]),
      expect.objectContaining({
        question: expect.any(String),
        answer: expect.any(String),
        option1: expect.any(String),
        option2: expect.any(String),
        option3: expect.any(String)
      })
    );
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { questions: mockMcqQuestions },
      { status: 200 }
    );
  });

  test('should generate open-ended questions when type is open_ended', async () => {
    mockReq.json.mockResolvedValueOnce({
      topic: 'JavaScript',
      type: 'open_ended',
      amount: 3
    });
    
    const mockOpenQuestions = [
      {
        question: "Explain how closures work in JavaScript",
        answer: "Functions retain access to parent scope when executed elsewhere"
      },
      {
        question: "How does prototypal inheritance function in JavaScript?",
        answer: "Objects inherit properties from prototype objects"
      },
      {
        question: "Describe event delegation in JavaScript",
        answer: "Parent element handles events for children"
      }
    ];

    strict_output.mockResolvedValueOnce(mockOpenQuestions);
    
    await POST(mockReq as any);
    
    expect(strict_output).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.stringContaining('JavaScript')]),
      expect.objectContaining({
        question: expect.any(String),
        answer: expect.any(String)
      })
    );
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { questions: mockOpenQuestions },
      { status: 200 }
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
    
    quizCreationSchema.parse.mockImplementationOnce(() => {
      throw zodError;
    });
    
    await POST(mockReq as any);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: zodError.issues },
      { status: 400 }
    );
  });

  test('should handle unexpected errors', async () => {
    strict_output.mockRejectedValueOnce(new Error('API call failed'));
    
    await POST(mockReq as any);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  });

  /* Uncomment this test if authentication is re-enabled
  test('should return 401 when user is not authenticated', async () => {
    getAuthSession.mockResolvedValueOnce(null);
    
    await POST(mockReq as any);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "You must be logged in to create a quiz" },
      { status: 401 }
    );
  });
  */
});
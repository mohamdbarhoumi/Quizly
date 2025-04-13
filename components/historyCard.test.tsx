import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoryCard from '../components/historyCard';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/', // Add other properties if your component uses them
    // ... other router properties you might need to mock
  })),
}));

describe('HistoryCard Component', () => {
  it('renders the title', () => {
    render(<HistoryCard />);
    expect(screen.getByText('History')).toBeInTheDocument();
  });
});
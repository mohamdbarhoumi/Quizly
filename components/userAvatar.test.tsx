import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAvatar from './userAvatar';
import Image from 'next/image';

// Mock next/image
jest.mock('next/image', () => {
    return function MockImage({ fill, ...props }: any) {
        return <img {...props} data-testid="mock-image" fill={fill ? 'true' : undefined} />;
  };
});

describe('UserAvatar Component', () => {
  it('renders the Image component when user has an image', () => {
    const mockUser = {
      name: 'John Doe',
      image: 'https://example.com/image.jpg',
    };
    render(<UserAvatar user={mockUser} />);

    const imageElement = screen.getByTestId('mock-image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockUser.image);
    expect(imageElement).toHaveAttribute('alt', 'profile picture');
    expect(imageElement).toHaveAttribute('referrerPolicy', 'no-referrer');
  });

  it('renders the AvatarFallback when user does not have an image', () => {
    const mockUser = {
      name: 'Jane Doe',
      image: null,
    };
    render(<UserAvatar user={mockUser} />);

    const fallbackElement = screen.getByText('Jane Doe');
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement).toHaveClass('sr-only');
  });

  it('renders the AvatarFallback with name even if image is undefined', () => {
    const mockUser = {
      name: 'Peter Pan',
      image: undefined,
    };
    render(<UserAvatar user={mockUser} />);

    const fallbackElement = screen.getByText('Peter Pan');
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement).toHaveClass('sr-only');
  });

  it('passes additional props to the Avatar component', () => {
    const mockUser = {
      name: 'Alice',
      image: 'https://example.com/alice.jpg',
    };
    render(<UserAvatar user={mockUser} className="custom-class" data-testid="user-avatar" />);

    const avatarElement = screen.getByTestId('user-avatar');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveClass('custom-class');
  });
});
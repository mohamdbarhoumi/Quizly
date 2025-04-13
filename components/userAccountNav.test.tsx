import React from 'react';

// Define the mock implementation for UserAvatar
const userAvatarMock = jest.fn().mockImplementation((props) => (
    <div data-testid="user-avatar" {...props} />
  ));
  
  // Mock the UserAvatar component
  jest.mock('./userAvatar', () => ({
    __esModule: true,
    default: userAvatarMock,
  }));
  
import { render, screen, fireEvent, within } from '@testing-library/react';
import UserAccountNav from '../components/userAccountNav';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

// Mock the DropdownMenu components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onSelect, className }: any) => (
    <button onClick={onSelect} className={className} data-testid="dropdown-item">
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}));


// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ fill, ...props }: any) {
    // We acknowledge the fill prop but don't pass it down directly
    return <img {...props} data-testid="mock-image" />;
  };
});

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: jest.fn(({ children, href }) => <a href={href}>{children}</a>),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  useSession: jest.fn(() => ({ data: { user: {} }, status: 'authenticated' })), // Mock useSession if your component uses it
}));

// Mock lucide-react LogOut
jest.mock('lucide-react', () => ({
  LogOut: () => <svg data-testid="log-out-icon" />,
}));

const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg',
};


describe('UserAccountNav Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Note: We don't need userAvatarMock.mockClear() here anymore as the mock is defined outside the describe block
  });


  it('renders user name and email in the dropdown content', () => {
    render(<UserAccountNav user={mockUser} />);

    const dropdownContent = screen.getByTestId('dropdown-content');
    expect(dropdownContent).toBeInTheDocument();
    expect(within(dropdownContent).getByText(mockUser.name)).toBeInTheDocument();
    expect(within(dropdownContent).getByText(mockUser.email)).toBeInTheDocument();
  });

  it('renders user name even if email is null', () => {
    const userWithoutEmail = { ...mockUser, email: null };
    render(<UserAccountNav user={userWithoutEmail} />);
    const dropdownContent = screen.getByTestId('dropdown-content');
    expect(dropdownContent).toBeInTheDocument();
    expect(within(dropdownContent).getByText(userWithoutEmail.name)).toBeInTheDocument();
    expect(within(dropdownContent).queryByText(userWithoutEmail.email || '')).toBeNull();
  });

  it('renders user email even if name is null', () => {
    const userWithoutName = { ...mockUser, name: null };
    render(<UserAccountNav user={userWithoutName} />);
    const dropdownContent = screen.getByTestId('dropdown-content');
    expect(dropdownContent).toBeInTheDocument();
    expect(within(dropdownContent).queryByText(userWithoutName.name || '')).toBeNull();
    expect(within(dropdownContent).getByText(mockUser.email)).toBeInTheDocument();
  });

  it('renders the Sign out button with the LogOut icon', () => {
    render(<UserAccountNav user={mockUser} />);
    const signOutButton = screen.getByRole('button', { name: /Sign out/i });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toContainElement(screen.getByTestId('log-out-icon'));
  });

  it('calls signOut when the Sign out button is clicked', () => {
    render(<UserAccountNav user={mockUser} />);
    const signOutButton = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(signOutButton);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('passes user data to UserAvatar', () => {
    render(<UserAccountNav user={mockUser} />);

    // Check if the UserAvatar mock was called with the correct props
    expect(userAvatarMock).toHaveBeenCalledWith({
      className: 'w-10 h-10',
      user: {
        name: mockUser.name || null,
        image: mockUser.image || null,
      },
    });
  });
});
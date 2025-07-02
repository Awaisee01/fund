
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AdminDashboard from '../../AdminDashboard';
import { useToast } from '@/hooks/use-toast';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        }))
      }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

describe('AdminDashboard', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin dashboard header', async () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });
  });

  it('displays stats overview', async () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('New Submissions')).toBeInTheDocument();
      expect(screen.getByText('Converted')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('shows search filter', async () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search submissions...')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      expect(mockOnLogout).toHaveBeenCalled();
    });
  });
});

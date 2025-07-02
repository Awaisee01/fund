
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchFilter } from '../SearchFilter';

describe('SearchFilter', () => {
  it('renders search input', () => {
    const mockOnSearch = vi.fn();
    render(<SearchFilter onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search submissions...')).toBeInTheDocument();
  });

  it('calls onSearch with debounced input', async () => {
    const mockOnSearch = vi.fn();
    render(<SearchFilter onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search submissions...');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    // Wait for debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 500 });
  });

  it('uses custom placeholder', () => {
    const mockOnSearch = vi.fn();
    render(<SearchFilter onSearch={mockOnSearch} placeholder="Custom placeholder" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });
});

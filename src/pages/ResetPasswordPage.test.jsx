import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import * as api from '../utils/api';

// Mock the entire api module
vi.mock('../utils/api');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock URLSearchParams
const mockToken = 'fake-reset-token';
const mockSearchParams = new URLSearchParams(`?token=${mockToken}`);

const renderResetPasswordPage = () => {
  return render(
    <BrowserRouter>
      <ResetPasswordPage />
    </BrowserRouter>
  );
};

describe('ResetPasswordPage', () => {
  vi.setConfig({ testTimeout: 10000 });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Reset any mocked implementations
    api.resetPassword.mockReset();
    
    // Reset location
    delete window.location;
    window.location = { search: mockSearchParams.toString() };

    // Add console log to see when beforeEach runs
    console.log('beforeEach: Setting up test environment');
  });

  afterEach(() => {
    console.log('afterEach: Cleaning up test environment');
    vi.clearAllTimers();
    vi.useRealTimers();
    
  });

  it('renders all form elements', () => {
    renderResetPasswordPage();
    
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('allows input in password fields', () => {
    renderResetPasswordPage();
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    
    expect(passwordInput).toHaveValue('newpassword123');
    expect(confirmPasswordInput).toHaveValue('newpassword123');
  });

  it('toggles password visibility', () => {
    renderResetPasswordPage();
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('shows error when passwords do not match', () => {
    renderResetPasswordPage();
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles successful password reset', async () => {
    // Setup API mock
    api.resetPassword.mockResolvedValueOnce({
      message: 'Password reset successful'
    });
    
    console.log('Test: Starting successful password reset test');
    renderResetPasswordPage();
    
    // Fill form
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    console.log('Test: Filling out form');
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    });
    
    // Click submit
    console.log('Test: Submitting form');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });
  
    // Wait for success message with a longer timeout
    await waitFor(() => {
      expect(screen.getByText('Password reset successful')).toBeInTheDocument();
    }, { timeout: 6000 });
  
    // Verify API was called
    expect(api.resetPassword).toHaveBeenCalledWith(mockToken, {
      password: 'newpassword123',
      confirmPassword: 'newpassword123'
    });
  
    // Handle navigation
    console.log('Test: Advancing timers for navigation');
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    console.log('Test: Successful password reset test completed');
  });
  
  it('handles reset password error', async () => {
    // Mock the API to reject with an error object that matches your actual API
    api.resetPassword.mockRejectedValueOnce({
      message: 'Invalid or expired token',
      toString: () => 'Invalid or expired token' // Add this to make the error message accessible
    });
    
    console.log('Test: Starting error test');
    renderResetPasswordPage();
    
    // Fill form
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    console.log('Test: Filling out form');
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    
    // Submit form and wait for error state to update
    console.log('Test: Submitting form');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
      // Wait for promises to resolve
      await Promise.resolve();
    });

    // Use try-catch to debug what's happening
    try {
      await waitFor(
        () => {
          const errorElement = screen.getByText('Invalid or expired token');
          console.log('Found error element:', errorElement);
          expect(errorElement).toBeInTheDocument();
        },
        { timeout: 6000 }
      );
    } catch (error) {
      console.log('Current document body:', document.body.innerHTML);
      throw error;
    }
    
    // Verify navigation wasn't called
    expect(mockNavigate).not.toHaveBeenCalled();
    console.log('Test: Error test completed');
  });

  
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import * as api from '../utils/api';

// Mock the entire api module
vi.mock('../utils/api');

// Mock ReCAPTCHA component
vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange }) => (
    <button onClick={() => onChange('fake-token')}>ReCAPTCHA</button>
  ),
}));

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements', () => {
    renderRegisterPage();
    
    // Check for form elements using their labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  it('allows input in all form fields', () => {
    renderRegisterPage();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('toggles password visibility', () => {
    renderRegisterPage();
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const showPasswordCheckbox = screen.getByLabelText(/show password/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(showPasswordCheckbox);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('validates required fields', async () => {
    renderRegisterPage();
    
    // Try to submit the empty form
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    // Should show error message for empty name
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderRegisterPage();
    
    // Fill in invalid email
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    // Fill in other required fields to isolate email validation
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Complete reCAPTCHA
    const recaptchaButton = screen.getByRole('button', { name: /recaptcha/i });
    fireEvent.click(recaptchaButton);
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Should show email validation error
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('validates password length', async () => {
    renderRegisterPage();
    
    // Fill in all fields but with a short password
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '12345' } });
    
    // Complete reCAPTCHA
    fireEvent.click(screen.getByRole('button', { name: /recaptcha/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Should show password length error
    expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
  });
  
  it('validates password matching', async () => {
    renderRegisterPage();
    
    // Fill in form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    
    // Complete reCAPTCHA
    fireEvent.click(screen.getByRole('button', { name: /recaptcha/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Should show password mismatch error
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
  
  it('handles successful registration', async () => {
    // Mock successful API response
    api.registerUser.mockResolvedValueOnce({
      message: 'Registration successful. Please check your email to verify your account.'
    });
  
    renderRegisterPage();
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Complete reCAPTCHA
    fireEvent.click(screen.getByRole('button', { name: /recaptcha/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Wait for success message
    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
    
    // Verify API was called with correct data
    expect(api.registerUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      recaptchaToken: 'fake-token'
    });
    
    // Verify the resend verification email form is shown
    expect(screen.getByLabelText(/email for verification/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
    expect(screen.getByText(/go to login/i)).toBeInTheDocument();
  });
  
  
  it('handles registration error for existing user', async () => {
    // Mock API error response
    api.registerUser.mockRejectedValueOnce({
      message: 'User already exists'
    });
  
    renderRegisterPage();
    
    // Fill in form data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Complete reCAPTCHA
    fireEvent.click(screen.getByRole('button', { name: /recaptcha/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for error message
    expect(await screen.findByText('An account with this email already exists')).toBeInTheDocument();
  });

  it('shows resend verification form when clicking resend link', async () => {
    renderRegisterPage();
    
    // Click the "Resend" span
    const resendLink = screen.getByText('Resend', { selector: 'span' });
    fireEvent.click(resendLink);
    
    // Verify resend form appears
    expect(screen.getByText('Enter your email:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend email/i })).toBeInTheDocument();
  });
  
  it('handles resend verification email submission', async () => {
    // Mock the API response
    api.resendVerification.mockResolvedValueOnce({
      message: 'Verification email resent. Please check your inbox.'
    });
  
    renderRegisterPage();
    
    // Click resend link to show form
    const resendLink = screen.getByText('Resend', { selector: 'span' });
    fireEvent.click(resendLink);
    
    // Find and fill the email input
    const emailInput = screen.getByLabelText('Enter your email:', { type: 'email' });
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /resend email/i });
    fireEvent.click(submitButton);
    
    // Verify success message
    expect(await screen.findByText(/verification email resent/i)).toBeInTheDocument();
    
    // Verify API was called
    expect(api.resendVerification).toHaveBeenCalledWith('test@example.com');
  });
});
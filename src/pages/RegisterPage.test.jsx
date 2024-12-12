import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Helper function to render component with router
const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  // Test 1: Basic rendering
  it('renders all form elements', () => {
    renderRegisterPage();
    
    // Check for form elements by their text content
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    
    // Check for input fields
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    
    // Password fields need special handling as they don't have role='textbox'
    const passwordInputs = screen.getAllByRole('textbox').filter(input => 
      input.getAttribute('type') === 'password'
    );
    expect(passwordInputs).toHaveLength(2);
    
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  // Test 2: Form input functionality
  it('allows input in all form fields', async () => {
    renderRegisterPage();
    
    // Get inputs by their placeholder or type
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInputs = screen.getAllByRole('textbox').filter(input => 
      input.getAttribute('type') === 'password'
    );
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    
    // Type in all fields
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Check if values are updated
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  // Test 3: Password visibility toggle
  it('toggles password visibility', () => {
    renderRegisterPage();
    
    const passwordInputs = screen.getAllByRole('textbox').filter(input => 
      input.getAttribute('type') === 'password'
    );
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    
    const toggleButton = screen.getByRole('checkbox', { name: /show password/i });
    
    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    fireEvent.click(toggleButton);
    
    // Passwords should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
});
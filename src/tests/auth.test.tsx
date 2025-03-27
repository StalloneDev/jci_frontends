import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { useAuth } from '@/lib/auth';

// Mock useAuth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

describe('Auth Components', () => {
  describe('Login Component', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        login: jest.fn(),
        loading: false,
        error: null,
      });
    });

    it('renders login form', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('shows validation errors', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe doit contenir/i)).toBeInTheDocument();
      });
    });

    it('calls login function with correct data', async () => {
      const mockLogin = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        loading: false,
        error: null,
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });
  });

  describe('Register Component', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        register: jest.fn(),
        loading: false,
        error: null,
      });
    });

    it('renders registration form', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /créer un compte/i })).toBeInTheDocument();
    });

    it('shows validation errors', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /créer un compte/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/le prénom doit contenir/i)).toBeInTheDocument();
        expect(screen.getByText(/le nom doit contenir/i)).toBeInTheDocument();
        expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe doit contenir/i)).toBeInTheDocument();
      });
    });

    it('validates password confirmation', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
        target: { value: 'different' },
      });

      fireEvent.click(screen.getByRole('button', { name: /créer un compte/i }));

      await waitFor(() => {
        expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
      });
    });
  });
});

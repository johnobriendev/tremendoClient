import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import BoardPage from './components/BoardPage';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './components/VerifyEmail';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AboutPage from './components/AboutPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail/>,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage/>,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage/>
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/boards/:boardId', // New route for a specific board
    element: (
      <ProtectedRoute>
        <BoardPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return(
    // <CardsProvider>
      <RouterProvider router={router} />
    // </CardsProvider>

  );
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import WorkInProgress from './pages/WorkInProgressPage';
import { ThemeProvider } from './context/ThemeContext';



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
    path: '/workinprogress',
    element: <WorkInProgress />,
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
   <ThemeProvider>
      <RouterProvider router={router} />
   </ThemeProvider>
      
   

  );
}

export default App;

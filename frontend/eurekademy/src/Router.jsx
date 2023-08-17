import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/UserPage/LoginPage';
import SignUpPage from './pages/UserPage/SignUpPage';

const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: <LoginPage/>
        // errorElement: <ErrorPage />,
    },
    {
        path: "/auth/signup",
        element: <SignUpPage/>
    }
]);

export default router;
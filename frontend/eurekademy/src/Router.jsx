import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/UserPage/LoginPage';
import SignUpPage from './pages/UserPage/SignUpPage';
import VerificationPage from './pages/UserPage/VerificationPage';

const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: <LoginPage/>
        // errorElement: <ErrorPage />,
    },
    {
        path: "/auth/signup",
        element: <SignUpPage/>
    },{
        path: "/verify/:token",
        element: <VerificationPage/>
    }
]);

export default router;
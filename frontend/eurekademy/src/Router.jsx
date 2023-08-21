import { createBrowserRouter } from "react-router-dom";
import ForgotPasswordPage from "./pages/UserPage/ForgotPasswordPage";
import LoginPage from "./pages/UserPage/LoginPage";
import ResetPasswordPage from "./pages/UserPage/ResetPasswordPage";
import SignUpPage from "./pages/UserPage/SignUpPage";
import VerificationPage from "./pages/UserPage/VerificationPage";

const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: <LoginPage />,
        // errorElement: <ErrorPage />,
    },
    {
        path: "/auth/signup",
        element: <SignUpPage />,
    },
    {
        path: "/verify/:token",
        element: <VerificationPage />,
    },
    {
        path: "/auth/forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "/auth/reset-password/:token",
        element: <ResetPasswordPage/>
    },
]);

export default router;

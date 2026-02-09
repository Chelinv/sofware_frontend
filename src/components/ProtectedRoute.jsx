import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute - Wrapper component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        // User not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the protected component
    return children;
};

export default ProtectedRoute;

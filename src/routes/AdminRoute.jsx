import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

const AdminRoute = (props) => {
    const { children } = props;
    const currentUser = useAuthStore((state) => state.currentUser);
    const isCheckingUser = useAuthStore((state) => state.isCheckingUser);

    // Show loading while checking user
    if (isCheckingUser) {
        return <h1>Loading admin dashboard...</h1>;
    }

    // If no user, redirect to login
    if (!currentUser) {
        console.log('AdminRoute: No user found, redirecting to login');
        return <Navigate to="/login" />;
    }

    // Check if user has admin label
    if (currentUser.labels && currentUser.labels.includes('admin')) {
        return children;
    }

    // User is not admin, redirect to home
    console.log('AdminRoute: User is not admin, redirecting to home');
    return <Navigate to="/" />
}

export default AdminRoute
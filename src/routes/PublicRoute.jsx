import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

const PublicRoute = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isCheckingUser = useAuthStore((state) => state.isCheckingUser);

  console.log('PublicRoute - isCheckingUser:', isCheckingUser, 'currentUser:', currentUser);

  // Show loading while checking authentication
  if (isCheckingUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Redirect based on user role if authenticated
  if (currentUser) {
    console.log('PublicRoute: User is authenticated, redirecting based on role');
    if (currentUser.labels && currentUser.labels.includes('admin')) {
      console.log('PublicRoute: Redirecting admin to /dashboard');
      return <Navigate to="/dashboard" />;
    }
    console.log('PublicRoute: Redirecting user to /user');
    return <Navigate to="/user" />;
  }

  // User is not authenticated, show public page
  console.log('PublicRoute: No user, showing public page');
  return children;
};

export default PublicRoute;

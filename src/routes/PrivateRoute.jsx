
import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";


function PrivateRoute(props) {
    const { children } = props;

    const currentUser = useAuthStore((state) => state.currentUser)
    const isCheckingUser = useAuthStore((state) => state.isCheckingUser)

    /**
     * 1. Empty Dependency Array: Run only once
     * 2. Act as componentDidMount()
     * 3. Doesn't get called after every re-render
     */

    console.log('PrivateRoute - isCheckingUser:', isCheckingUser, 'currentUser:', currentUser);

    if (isCheckingUser) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="relative flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                        <span className="text-white font-bold text-2xl">SF</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-white/60 text-sm font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!currentUser) {
        console.log('PrivateRoute: No user found, redirecting to login');
        return (
            <Navigate to="/login" />
        )
    }

    console.log('PrivateRoute: User authenticated, rendering protected content');
    return children;
}

export default PrivateRoute;
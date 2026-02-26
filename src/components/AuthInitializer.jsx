import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import useAuthStore from '../store/authStore';
import AppwriteAccount from '../appwrite/Account.services';

/**
 * AuthInitializer - Initializes authentication state globally
 * This runs once when the app loads, regardless of the route
 */
export function AuthInitializer({ children }) {
    const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
    const setIsCheckingUser = useAuthStore((state) => state.setIsCheckingUser);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const appwriteAccount = new AppwriteAccount();

        async function initAuth() {
            console.log('🔐 AuthInitializer: Starting auth check...');

            try {
                const user = await appwriteAccount.getAppwriteUser();
                console.log('🔐 AuthInitializer: User from Appwrite:', user);

                setCurrentUser(user);
                setIsCheckingUser(false);

                console.log('🔐 AuthInitializer: Auth state initialized', {
                    user: user ? user.$id : 'No user',
                    isAdmin: user?.labels?.includes('admin'),
                    currentPath: location.pathname
                });

            } catch (error) {
                console.error('🔐 AuthInitializer: Error during auth check:', error);
                setCurrentUser(null);
                setIsCheckingUser(false);
            }
        }

        initAuth();
    }, []); // Run only once on mount

    return children;
}

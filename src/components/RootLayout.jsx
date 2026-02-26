import { useEffect } from 'react';
import { Outlet } from 'react-router';
import useAuthStore from '../store/authStore';
import AppwriteAccount from '../appwrite/Account.services';

/**
 * RootLayout - Wraps all routes and initializes auth state globally
 */
export function RootLayout() {
    const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
    const setIsCheckingUser = useAuthStore((state) => state.setIsCheckingUser);

    useEffect(() => {
        const appwriteAccount = new AppwriteAccount();

        async function initAuth() {
            console.log('🔐 RootLayout: Starting auth check...');

            try {
                const user = await appwriteAccount.getAppwriteUser();
                console.log('🔐 RootLayout: User from Appwrite:', user);

                setCurrentUser(user);
                setIsCheckingUser(false);

                console.log('🔐 RootLayout: Auth state initialized', {
                    user: user ? user.$id : 'No user',
                    isAdmin: user?.labels?.includes('admin')
                });

            } catch (error) {
                console.error('🔐 RootLayout: Error during auth check:', error);
                setCurrentUser(null);
                setIsCheckingUser(false);
            }
        }

        initAuth();
    }, []); // Run only once on mount

    return <Outlet />;
}

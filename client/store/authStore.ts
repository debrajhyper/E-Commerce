import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import { EMPTY_STR, AUTH_STORE_NAME } from '@/constants';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Auth store
 * @note This store is persisted in session storage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            /**
             * Is user logged in
             */
            isLoggedIn: false,
            /**
             * Authentication token
             */
            token: EMPTY_STR,
            /**
             * Login the user
             * @param token authentication token
             */
            login: (token: string) => {
                set({ isLoggedIn: true, token });
            },
            /**
             * Logout the user
             */
            logout: () => {
                set({ isLoggedIn: false, token: EMPTY_STR });
                sessionStorage.clear();
            },
            /**
             * Verify the auth token
             * @returns true if the token is valid, false otherwise
             */
            verifyToken: () => {
                const token = get().token;
                if (!token) return false;
                try {
                    const { exp } = jwtDecode<{ exp: number }>(token);
                    if (Date.now() >= exp * 1000) {
                        get().logout();
                        return false;
                    }
                    return true;
                } catch (e) {
                    get().logout();
                    return false;
                }
            },
            /**
             * Get the role from the token
             * @returns the role of the user if the token is valid, null otherwise
             */
            getRoleFromToken: () => {
                const token = get().token;
                if (!token) return null;
                try {
                    const { role } = jwtDecode<{ role: string }>(token);
                    return role;
                } catch (e) {
                    return null;
                }
            },
        }),
        {
            name: AUTH_STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
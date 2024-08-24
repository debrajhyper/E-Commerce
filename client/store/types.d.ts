type AuthState = {
    isLoggedIn: boolean;
    token: string;
    login: (token: string) => void;
    logout: () => void;
    verifyToken: () => boolean;
    getRoleFromToken: () => string | null;
}
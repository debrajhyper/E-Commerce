import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

export const verifyToken = (token: string | undefined) => {
    if (!token) return false;
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
            return false;
        }
        return true;
    } catch (e) {
        console.error('Token verification failed:', e);
        return false;
    }
}

export const getRoleFromToken = (token: string | undefined) => {
    if (!token) return null;
    try {
        const { role } = jwtDecode<{ role: string }>(token);
        return role;
    } catch (e) {
        return null;
    }
}
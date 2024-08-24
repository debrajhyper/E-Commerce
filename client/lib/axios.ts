import axios from 'axios';
import { verifyToken } from '@/helpers/authHelper';
import { AUTH_STORE_NAME } from '@/constants';

/**
 * Create an instance of axios with the base URL set to the API base URL
 */
export const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL,
});

/**
 * Add an interceptor to add the authorization token to the request
 * if the token is valid
 */
apiClient.interceptors.request.use((config) => {
    /**
     * Get the token from session storage
     */
    const token = JSON.parse(sessionStorage.getItem(AUTH_STORE_NAME) || '{}')?.state?.token;

    /**
     * Check if the token is valid
     */
    const isTokenValid = verifyToken(token);

    if (token && isTokenValid) {
        /**
         * Add the token to the request headers
         */
        config.headers.Authorization = token;
    } else {
        /**
         * Remove the token from the request headers
         */
        delete config.headers.Authorization;

        /**
         * Remove the token from session storage and the cookie
         */
        sessionStorage.removeItem(AUTH_STORE_NAME);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Add an interceptor to handle errors
 */
apiClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        /**
         * If the error is a 401, return the error
         */
        return Promise.reject(error);
    }
    return Promise.reject(error);
});
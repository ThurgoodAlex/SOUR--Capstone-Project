/**
 * api.tsx
 * 
 * Provides an abstraction for interacting with the backend API. Contains methods for making authenticated 
 * HTTP requests (GET, POST, POST with form data). Automatically attaches the authorization token when available.
 */

import { useAuth } from "@/context/auth";

// API utility function
const api = (token: string | null = null) => {
    // local host url
    //   const baseUrl = "http://127.0.0.1:8000";
    // emma's url
    const baseUrl = 'http://192.168.0.102:8000';

    const getAuthHeaders = () => {

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    };

    // GET request method with logging
    const get = async (url: string) => {
        const headers = getAuthHeaders();
        console.log("GET Request URL:", baseUrl + url);
        console.log("GET Headers:", headers);

        return fetch(baseUrl + url, {
            method: "GET",
            headers,
        });
    };

    // POST request method with logging
    const post = async (url: string, body: Record<string, unknown>) => {
        const headers = getAuthHeaders();
        console.log("POST Request URL:", baseUrl + url);
        console.log("POST Body:", JSON.stringify(body));
        console.log("POST Headers:", headers);

        return fetch(baseUrl + url, {
            method: "POST",
            body: JSON.stringify(body),
            headers,
        });
    };

    return { get, post };
};

// Custom hook to provide the API instance with the current token
const useApi = () => {
    const { token } = useAuth();
    return api(token);
};

export { api, useApi };

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
     const baseUrl = "http://127.0.0.1:8000";
    // emma's url
    //const baseUrl = 'http://10.17.49.158:8000';

    const getAuthHeaders = () => {

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Accept": "application/json"
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
    const post = async (url: string, body: Record<string, unknown> = {}) => {
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


    // have to call it remove becuase delete is not allowed as a method name :(
    const remove = async (url: string, body: Record<string, unknown> = {}) => {
        const headers = getAuthHeaders();
        console.log("DELETE Request URL:", baseUrl + url);
        console.log("DELETE Body:", JSON.stringify(body));
        console.log("DELETE Headers:", headers);

        return fetch(baseUrl + url, {
            method: "DELETE",
            body: JSON.stringify(body),
            headers,
        });
    };

    // PUT request method
    const put = async (url: string, body: Record<string, unknown> = {}) => {
        const headers = getAuthHeaders();
        console.log("PUT Request URL:", baseUrl + url);
        console.log("PUT Headers:", headers);

        return fetch(baseUrl + url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    };

     // login needs separate logic because it uses Form Encoded URL params (with the new swagger fix)
     const login = async (body: URLSearchParams) => {
        const headers = {"Content-Type": "application/x-www-form-urlencoded", 'accept': 'application/json',};
    
        console.log("POST Request URL:", baseUrl + "/auth/token/");
        console.log("POST Body:", body.toString());
        console.log("POST Headers:", headers);

        return fetch(baseUrl + "/auth/token/", {
            method: "POST",
            body: body.toString(),
            headers,
        });
    };

    return { get, post, put, remove, login };
};

// Custom hook to provide the API instance with the current token
const useApi = () => {
    const { token } = useAuth();
    return api(token);
};

export { api, useApi };

/**
 * api.tsx
 * 
 * Provides an abstraction for interacting with the backend API. Contains methods for making authenticated 
 * HTTP requests (GET, POST, POST with form data). Automatically attaches the authorization token when available.
 */

import { useAuth } from "@/context/auth";
import { fullUrl } from "@/context/urls";

// API utility function
const api = (token: string | null = null) => {
    //tunnel URL
    const localhost = fullUrl;


    const getAuthHeaders = () => {

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        };
        return headers;
    };

    const getFormHeaders = () => {
        const headers: Record<string, string> = {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        };
        return headers;
    };


    // GET request method with logging
    const get = async (url: string) => {
        const headers = getAuthHeaders();
        console.log("GET Request URL:", localhost + url);
        console.log("GET Headers:", headers);

        return fetch(localhost + url, {
            method: "GET",
            headers,
        });
    };

    // POST request method with logging
    const post = async (url: string, body: Record<string, unknown> = {}) => {
        const headers = getAuthHeaders();
        console.log("POST Request URL:", localhost + url);
        console.log("POST Body:", JSON.stringify(body));
        console.log("POST Headers:", headers);

        return fetch(localhost + url, {
            method: "POST",
            body: JSON.stringify(body),
            headers,
        });
    };

    const postForm = async (url: string, formData: FormData) => {
      console.log("Starting postForm with URL:", url);
      console.log("FormData argument received:", formData);
    
      const headers = getFormHeaders();
      console.log("Headers retrieved:", headers);
    
      console.log("Constructing full URL...");
      const fullUrl = localhost + url;
     
      try {
        console.log("Executing fetch request to:", fullUrl);
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: headers,
          body: formData,
        });
    
        console.log("Fetch response status:", response.status);
    
        if (response.ok) {
          const responseBody = await response.json();
          console.log("Response body:", responseBody);
          return {
            ok: true,
            status: response.status,
            json: () => Promise.resolve(responseBody),
          };
        } else {
          const responseText = await response.text();
          console.error("Fetch failed with status:", response.status);
          console.error("Response text:", responseText);
          throw new Error(`Upload failed: ${response.status} - ${responseText}`);
        }
      } catch (error) {
        console.error("Fetch error occurred:", error);
        throw new Error("Network request failed");
      }
    };
    

    // have to call it remove becuase delete is not allowed as a method name :(
    const remove = async (url: string, body: Record<string, unknown> = {}) => {
        const headers = getAuthHeaders();
        console.log("DELETE Request URL:", localhost + url);
        console.log("DELETE Body:", JSON.stringify(body));
        console.log("DELETE Headers:", headers);

        return fetch(localhost + url, {
            method: "DELETE",
            body: JSON.stringify(body),
            headers,
        });
    };

    // PUT request method
    const put = async (url: string, body: Record<string, unknown> = {}) => {
        const headers = getAuthHeaders();
        console.log("PUT Request URL:", localhost + url);
        console.log("PUT Headers:", headers);

        return fetch(localhost + url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    };

     // login needs separate logic because it uses Form Encoded URL params (with the new swagger fix)
     const login = async (body: URLSearchParams) => {
        const headers = {"Content-Type": "application/x-www-form-urlencoded", 'accept': 'application/json',};
    
        console.log("POST Request URL:", localhost + "/auth/token/");
        console.log("POST Body:", body.toString());
        console.log("POST Headers:", headers);

        return fetch(localhost + "/auth/token/", {
            method: "POST",
            body: body.toString(),
            headers,
        });
    };

    return { get, post, put, remove, login, postForm };
};

// Custom hook to provide the API instance with the current token
const useApi = () => {
    const { token } = useAuth();
    return api(token);
};

export { api, useApi };

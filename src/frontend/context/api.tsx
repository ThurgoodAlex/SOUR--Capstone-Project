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

     const baseUrl = "http://10.18.145.245:8000";
     //const baseUrl = "http://10.18.224.228:8000";

    // emma's url
    //const baseUrl = 'http://10.18.236.253:8000';

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

    const postForm = async (url: string, formData: FormData) => {
      console.log("Starting postForm with URL:", url);
      console.log("FormData argument received:", formData);
    
      console.log("Attempting to get form headers...");
      const headers = getFormHeaders();
      console.log("Headers retrieved:", headers);
    
      console.log("Constructing full URL...");
      const fullUrl = baseUrl + url;
      console.log("POSTform Request URL:", fullUrl);
    
      console.log("Inspecting FormData...");
      console.log("FormData file field:", formData.get("file"));
      try {
        console.log("Attempting to iterate FormData entries...");
        formData.forEach((value, key) => {
          console.log(`FormData entry - ${key}:`, value);
        });
      } catch (error) {
        console.error("Error inspecting FormData entries:", error);
      }
    
      console.log("POSTform Headers (before modification):", headers);
      console.log("Removing Content-Type from headers...");
      delete headers["Content-Type"]; // Let XMLHttpRequest set multipart/form-data
      console.log("POSTform Headers (after removing Content-Type):", headers);
    
      console.log("Preparing XMLHttpRequest...");
      console.log("Request method:", "POST");
      console.log("Request body:", formData);
      console.log("Request headers:", headers);
    
      return new Promise((resolve, reject) => {
        console.log("Executing XMLHttpRequest to:", fullUrl);
        const xhr = new XMLHttpRequest();
    
        // Set up event listeners
        xhr.onload = () => {
          console.log("XHR completed with status:", xhr.status);
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Response text:", xhr.responseText);
            const response = {
              ok: true,
              status: xhr.status,
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            };
            console.log("Returning response...");
            resolve(response);
          } else {
            console.error("XHR failed with status:", xhr.status);
            console.error("XHR response text:", xhr.responseText);
            reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`));
          }
        };
    
        xhr.onerror = () => {
          console.error("XHR error occurred");
          reject(new Error("Network request failed"));
        };
    
        xhr.ontimeout = () => {
          console.error("XHR timed out");
          reject(new Error("Request timed out"));
        };
    
        // Configure request
        xhr.open("POST", fullUrl, true);
        xhr.timeout = 10000; // 10s timeout
    
        // Set headers
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value);
        }
    
        // Send request
        xhr.send(formData);
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

    return { get, post, put, remove, login, postForm };
};

// Custom hook to provide the API instance with the current token
const useApi = () => {
    const { token } = useAuth();
    return api(token);
};

export { api, useApi };

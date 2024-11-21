/**
 * api.tsx
 * 
 * Provides an abstraction for interacting with the backend API. Contains methods for making authenticated 
 * HTTP requests (GET, POST, POST with form data). Automatically attaches the authorization token when available.
 *
 * Exports:
 * - `api`: A function to make API requests with automatic token management.
 * - `useApi`: A custom hook that provides the `api` function with the user's token.
 *
 * Usage:
 * - Use `useApi` to get API methods like `get`, `post`, and `postForm` in components.
 * 
 */


// API utility function
const api = () => {
    const baseUrl = "http://127.0.0.1:8000"; 
  
    const get = (url: string) =>
      fetch(baseUrl + url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
    const post = (url: string, body: Record<string, unknown>) =>
      fetch(baseUrl + url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
    return { get, post };
  };


const useApi = () => {
  return api();
};

export { api, useApi };

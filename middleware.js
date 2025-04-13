export default function middleware(request) {
    // Get the URL of the request
    const url = new URL(request.url);

    // Set headers for requests to help with YouTube embedding
    const response = new Response();

    // Create a Headers object with the response headers
    const headers = new Headers(response.headers);

    // Add specific headers to allow YouTube embedding
    headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    // Return a new Response with the updated headers
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

// Only run this middleware on all routes
export const config = {
    matcher: '/(.*)',
}; 
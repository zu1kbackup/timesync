export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Handle API routes if needed
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({
          message: 'API endpoint',
          path: url.pathname
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // For SPA routing, serve index.html for non-asset requests
      const assetResponse = await env.ASSETS.fetch(request);

      // If asset not found and it's a navigation request, serve index.html
      if (assetResponse.status === 404 && request.method === 'GET') {
        const acceptHeader = request.headers.get('Accept') || '';
        if (acceptHeader.includes('text/html')) {
          const indexRequest = new Request(new URL('/index.html', request.url), request);
          return await env.ASSETS.fetch(indexRequest);
        }
      }

      return assetResponse;
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

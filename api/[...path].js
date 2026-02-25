export const config = { runtime: 'edge' };

export default async function handler(request) {
  const backendUrl = process.env.TUNIX_BACKEND_BASE_URL;

  if (!backendUrl) {
    return new Response(JSON.stringify({ error: 'Backend not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const backendPath = url.pathname.replace(/^\/api/, '');
  const targetUrl = `${backendUrl}${backendPath}${url.search}`;

  const init = {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

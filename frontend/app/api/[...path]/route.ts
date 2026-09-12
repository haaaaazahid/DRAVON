import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const BACKEND_URL = 'https://dravon-api.onrender.com';

async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const upstreamPath = url.pathname.replace(/^\/api/, '') || '/';
  const upstream = `${BACKEND_URL}${upstreamPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(upstream, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-length');
  responseHeaders.delete('content-encoding');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
export const HEAD = proxy;

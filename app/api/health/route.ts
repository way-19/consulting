export async function GET() {
  return new Response(JSON.stringify({ 
    ok: true, 
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV 
  }), {
    headers: { 'content-type': 'application/json' }
  });
}
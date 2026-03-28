export async function handleApi(_req: Request): Promise<Response> {
  return new Response("Not found", { status: 404 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/chores", "");

  const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/chores${path}`, {
    method: "GET",
    headers: request.headers,
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/chores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

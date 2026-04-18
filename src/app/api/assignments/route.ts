export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/assignments", "");

  const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignments${path}`, {
    method: "GET",
    headers: request.headers,
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const isReset = url.pathname.includes("/reset");
  
  let response;
  if (isReset) {
    response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignments/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const body = await request.json();
    response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (response.status === 204 || response.status === 201) {
    return new Response(null, { status: response.status });
  }

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

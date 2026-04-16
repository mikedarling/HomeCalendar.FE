import { NextRequest } from "next/server";

type Props = { params: Promise<{ choreId: string; assigneeId: string }> }

export async function PUT(request: NextRequest, { params }: Props) {
  const { choreId, assigneeId } = await params;
  const body = await request.json();
  const { weekday } = body;
  const backendUrl = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignments/${choreId}/${assigneeId}/${weekday}`;

  const response = await fetch(backendUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const responseData = await response.json();
  return Response.json(responseData, { status: response.status });
}

type Props2 = { params: Promise<{ choreId: string; assigneeId: string }> }

export async function DELETE(request: NextRequest, { params }: Props2) {
  const { choreId, assigneeId } = await params;
  const backendUrl = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignments/${choreId}/${assigneeId}`;

  const response = await fetch(backendUrl, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: response.status });
}

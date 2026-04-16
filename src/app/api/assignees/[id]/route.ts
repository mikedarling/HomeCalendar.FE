import { NextRequest } from "next/server";

type Props = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const backendUrl = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignees/${id}`;
  const body = await request.json();

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

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const backendUrl = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/assignees/${id}`;

  const response = await fetch(backendUrl, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: response.status });
}

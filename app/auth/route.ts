import { db } from "@/lib/db";

export async function signUp(request: Request) {
  const { name, email, password } = await request.json();

  const response = await db.query(
    "INSERT INTO users VALUES(name, email, password_hash)",
    [name, email, password],
  );

  return Response.json(response.rows);
}

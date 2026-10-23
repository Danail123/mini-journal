import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { description } = await request.json();

  const result = await db.query(
    "INSERT INTO posts (description) VALUES ($1) RETURNING *",
    [description],
  );

  return Response.json(result.rows[0]);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");
  console.log(date);

  const result = await db.query(
    `SELECT *
     FROM posts
     WHERE created_at >= $1::date
       AND created_at < ($1::date + INTERVAL '1 day')
     ORDER BY created_at DESC`,
    [date],
  );
  return Response.json(result.rows);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const result = await db.query("DELETE FROM posts WHERE id = $1 RETURNING *", [
    id,
  ]);

  return Response.json(result.rows);
}

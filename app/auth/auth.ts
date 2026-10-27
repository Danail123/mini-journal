"use server";
import bcrypt from "bcrypt";

import { db } from "../../lib/db";
import { createSession } from "@/lib/sessions";
import { redirect } from "next/dist/server/api-utils";

export async function signup(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email");
  const password = formData.get("password")?.toString();

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users(name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name",
      [name, email, hashedPassword],
    );
    const user = result.rows[0];

    await createSession({
      userId: user.id,
      name: user.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}

"use server";
import bcrypt from "bcrypt";

import { db } from "../../lib/db";

export async function signup(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email");
  const password = formData.get("password")?.toString();

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await db.query(
      "INSERT INTO users(name, email, password_hash)" + "VALUES ($1, $2, $3)",
      [name, email, hashedPassword],
    );

    console.log(response.rows);
  }
}

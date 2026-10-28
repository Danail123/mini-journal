import { cookies } from "next/headers";
import { signup } from "../auth/auth";
import { decrypt } from "@/lib/sessions";

export default async function Register() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return (
    <div className="main">
      <form action={signup}>
        <div className="name">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" />
        </div>
        <div className="password">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" />
        </div>
        <div className="email-div">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div className="">{session?.name}</div>
    </div>
  );
}

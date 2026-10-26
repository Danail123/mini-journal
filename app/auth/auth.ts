const bcrypt = require("bcrypt");

export async function signup(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const hashedPassword = await bcrypt.hash(password);

  const data = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  const response = await fetch("./route.ts", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log(await response.json());
}

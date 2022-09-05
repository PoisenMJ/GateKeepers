import { getAPIEndpoint } from "../util/api";
import { GenericResponse } from "../types/api";
import { User } from "../types/util/user";

async function createUser(
  username: string,
  email: string,
  password: string
): Promise<boolean> {
  const res = await fetch(getAPIEndpoint("/users"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const json: GenericResponse = await res.json();
  if (json.status === "ok") return true;
  else return false;
}

async function login(
  username: string,
  password: string
): Promise<{ token: string; user: User } | null> {
  const res = await fetch(getAPIEndpoint("/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const json: {
    status: string;
    token: string;
    user: User;
  } = await res.json();
  if (json.status === "ok") return { token: json.token, user: json.user };
  else return null;
}

export { createUser, login };

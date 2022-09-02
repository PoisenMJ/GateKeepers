import { getAPIEndpoint } from "../util/api";

async function createUser(
  username: string,
  email: string,
  password: string
): Promise<boolean> {
  const res = await fetch(getAPIEndpoint("/users/"));
  if(res.status === 201) {
    return true;
  }
  return false;
}

export {
  createUser
}

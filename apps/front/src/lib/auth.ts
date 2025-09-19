import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient as _createAuthClient } from "better-auth/react";
import { API_URL } from "./settings";


const createAuthClient = () => {
  return _createAuthClient({
    baseURL: API_URL(),
    plugins: [magicLinkClient()]
  });
};


export const getAuthClient = () =>  {
  let authClient: ReturnType<typeof createAuthClient> | null = null;

  if (!authClient) {
    authClient = createAuthClient();
  }
  return authClient;
};

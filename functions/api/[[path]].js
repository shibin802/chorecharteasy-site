import { handleApiRequest } from "../_lib/api.mjs";

export async function onRequest(context) {
  return handleApiRequest(context);
}

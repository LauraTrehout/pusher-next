import { getPusherInstance } from "../../../../config/pusher";

const pusher = getPusherInstance();

export async function POST(req) {
  const data = await req.text();
  const [socketId, userId] = data.split("&").map((str) => str.split("=")[1]);
  const user = {
    id: userId,
  };
  const authResponse = pusher.authenticateUser(socketId, user);
  return new Response(JSON.stringify(authResponse));
}

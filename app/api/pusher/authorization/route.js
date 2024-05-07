import { getPusherInstance } from "../../../../config/pusher";

const pusher = getPusherInstance();

export async function POST(req) {
  const data = await req.text();
  const [socketId, channelName, userId] = data
    .split("&")
    .map((str) => str.split("=")[1]);
  console.log(userId);
  if (userId % 2 === 0) {
    const authResponse = pusher.authorizeChannel(socketId, channelName);
    return new Response(JSON.stringify(authResponse));
  } else {
    return new Response(null, { status: 403 });
  }
}

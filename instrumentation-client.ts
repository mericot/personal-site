import { initBotId } from "botid/client/core";

// Vercel BotID: attaches an invisible challenge to signup requests, checked by checkBotId() in the route.
initBotId({
  protect: [{ path: "/api/subscribe", method: "POST" }],
});

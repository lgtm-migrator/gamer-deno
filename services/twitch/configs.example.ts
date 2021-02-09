import { fromFileUrl } from "./deps.ts";

export const configs = {
  // Your Twitch Client ID here. (https://dev.twitch.tv/docs/v5#getting-a-client-id)
  clientID: "",
  // Your Twitch Client Secret here. (You can get it in your Dashboard https://dev.twitch.tv/console/apps)
  clientSecret: "",
  database: {
    directoryPath: `${
      fromFileUrl(
        Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/")),
      )
    }/db/`,
    // Your mongodb atlas connection url string here
    connectionURL: "",
    name: "dev",
  },
};

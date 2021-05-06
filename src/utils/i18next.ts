import { bot } from "../../cache.ts";
import { cache, sendMessage, sendWebhook, snowflakeToBigint } from "../../deps.ts";
import i18next from "https://deno.land/x/i18next@v19.6.3/index.js";
import Backend from "https://deno.land/x/i18next_fs_backend/index.js";
import { configs } from "../../configs.ts";

/** This function helps translate the string to the specific guilds needs. */
export function translate(
  guildId: string,
  key: string,
  options: { returnObjects: true; [key: string]: unknown }
): string[];
export function translate(
  guildId: string,
  key: string,
  options?: { returnObjects: false; [key: string]: unknown }
): string;
export function translate(guildId: string, key: string, options?: Record<string, unknown>): string;
export function translate(guildId: string, key: string, options?: Record<string, unknown>) {
  // SUPPORT LEGACY STRINGS
  if (key === "") return "";

  const guild = cache.guilds.get(snowflakeToBigint(guildId));
  let language = bot.guildLanguages.get(guildId) || guild?.preferredLocale || "en_US";

  // Discord names some like `ru` and so we make it `ru_RU` for our json files
  if (language.length === 2) {
    language = `${language}_${language.toUpperCase()}`;
  }

  // undefined is silly bug cause i18next dont have proper typings
  const languageMap = i18next.getFixedT(language.replace("-", "_"), undefined) || i18next.getFixedT("en_US", undefined);

  return languageMap(key, options);
}

/** This function helps translate the string to the specific guilds needs. This is meant for translating a full array of strings. */
export function translateArray(guildId: string, key: string, options?: Record<string, unknown>): string[] {
  const guild = cache.guilds.get(snowflakeToBigint(guildId));
  const language = bot.guildLanguages.get(guildId) || guild?.preferredLocale || "en_US";

  // undefined is silly bug cause i18next dont have proper typings
  const languageMap = i18next.getFixedT(language.replace("-", "_"), undefined) || i18next.getFixedT("en_US", undefined);

  return languageMap(key, { ...options, returnObjects: true });
}

export async function determineNamespaces(path: string, namespaces: string[] = [], folderName = "") {
  const files = Deno.readDirSync(Deno.realPathSync(path));

  for (const file of files) {
    if (file.isDirectory) {
      const isLanguage = file.name.includes("-") || file.name.includes("_");

      namespaces = await determineNamespaces(`${path}/${file.name}`, namespaces, isLanguage ? "" : `${file.name}/`);
    } else {
      namespaces.push(`${folderName}${file.name.substr(0, file.name.length - 5)}`);
    }
  }

  return [...new Set(namespaces)];
}

export async function loadLanguages() {
  const namespaces = await determineNamespaces(Deno.realPathSync("./src/languages"));
  const languageFolder = [...Deno.readDirSync(Deno.realPathSync("./src/languages"))];

  return i18next.use(Backend).init(
    {
      initImmediate: false,
      fallbackLng: "en_US",
      interpolation: { escapeValue: false },
      load: "all",
      lng: "en_US",
      saveMissing: true,
      // Log to discord/console that a string is missing somewhere.
      missingKeyHandler: async function (lng: string, ns: string, key: string, fallbackValue: string) {
        const response = `${configs.userIDs.botDevs
          .map((id) => `<@${id}>`)
          .join(" ")} Missing translation key: ${ns}:${key} for ${lng} language. Instead using: ${fallbackValue}`;
        console.warn(response);

        if (!configs.webhooks.missingTranslation.id) return;

        const args = key.split("_");
        if (key.endsWith("_USAGE") && bot.commands.has(args[0]?.toLowerCase())) {
          return;
        }

        if (
          [
            "INVITES",
            "SERVERS",
            "PERMS",
            "MESSAGES",
            "CHANNELS",
            "ROLES",
            "BOTS",
            "NITRO",
            "HYPESQUADS",
          ].some((ignore) => key.startsWith(ignore)) &&
          key.endsWith("NOTE")
        ) {
          return;
        }

        await sendWebhook(
          snowflakeToBigint(configs.webhooks.missingTranslation.id),
          configs.webhooks.missingTranslation.token,
          { content: response }
        );
      },
      preload: languageFolder
        .map((file) => (file.isDirectory ? file.name : undefined))
        // Removes any non directory names(language names)
        .filter((name) => name),
      ns: namespaces,
      backend: {
        loadPath: `${Deno.realPathSync("./src/languages")}/{{lng}}/{{ns}}.json`,
      },
      // Silly bug in i18next needs a second param when unnecessary
    },
    undefined
  );
}

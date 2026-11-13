import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  MessageFlags,
} from "discord.js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { roasts, facts } from "./roasts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const OPTOUT_FILE = join(DATA_DIR, "optouts.json");

// --- opt-out persistence (anyone can wave the white flag with /truce) ---
let optouts = new Set();
try {
  optouts = new Set(JSON.parse(readFileSync(OPTOUT_FILE, "utf8")));
} catch {
  /* first run, no file yet */
}
function saveOptouts() {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(OPTOUT_FILE, JSON.stringify([...optouts]));
}

// --- per-user cooldown so the bot roasts, not spams ---
const COOLDOWN_MS = 15_000;
const lastRoastAt = new Map();

// avoid repeating the same roast back-to-back per channel
const lastRoastIndex = new Map();
function pickRoast(channelId) {
  let i;
  do {
    i = Math.floor(Math.random() * roasts.length);
  } while (roasts.length > 1 && i === lastRoastIndex.get(channelId));
  lastRoastIndex.set(channelId, i);
  return roasts[i];
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}. Twenty times, Man United... heard it, countered it, ready.`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "roast": {
        const target = interaction.options.getUser("victim", true);

        if (target.id === client.user.id) {
          await interaction.reply(
            "Roast myself? I'm not a United fan, I don't do self-sabotage."
          );
          return;
        }
        if (target.bot) {
          await interaction.reply(
            "That's a bot. Bots have no feelings. United fans barely do either, but at least theirs are fun to poke."
          );
          return;
        }
        if (optouts.has(target.id)) {
          await interaction.reply({
            content: `${target} has signed a truce. Even the Glazers honour a contract occasionally. Pick another victim.`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const now = Date.now();
        const last = lastRoastAt.get(interaction.user.id) ?? 0;
        if (now - last < COOLDOWN_MS) {
          const wait = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
          await interaction.reply({
            content: `Easy, tiger. Even United's attack waits longer between shots. Try again in ${wait}s.`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        lastRoastAt.set(interaction.user.id, now);

        const roast = pickRoast(interaction.channelId).replaceAll(
          "{user}",
          target.toString()
        );
        await interaction.reply(`🔥 ${roast}`);
        return;
      }

      case "glazernomics": {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        await interaction.reply(`📉 **Glazernomics 101:** ${fact}`);
        return;
      }

      case "truce": {
        if (optouts.has(interaction.user.id)) {
          optouts.delete(interaction.user.id);
          saveOptouts();
          await interaction.reply({
            content:
              "Truce revoked. Welcome back to the firing line — braver than any United board member.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          optouts.add(interaction.user.id);
          saveOptouts();
          await interaction.reply({
            content:
              "Truce signed. The bot will no longer roast you. (Running away from a fight — are you SURE you're not United's midfield?)",
            flags: MessageFlags.Ephemeral,
          });
        }
        return;
      }
    }
  } catch (err) {
    console.error("Interaction failed:", err);
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction
        .reply({
          content: "The bot fumbled that one. Very on-brand for the subject matter.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => {});
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Missing DISCORD_TOKEN. Copy .env.example to .env and fill it in.");
  process.exit(1);
}
client.login(token);

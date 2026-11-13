import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Publicly roast a Manchester United fan of your choosing.")
    .addUserOption((opt) =>
      opt
        .setName("victim")
        .setDescription("The United fan who needs humbling")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("glazernomics")
    .setDescription("A devastating fact about the state of Manchester United."),
  new SlashCommandBuilder()
    .setName("truce")
    .setDescription("Toggle whether the bot is allowed to roast you."),
].map((c) => c.toJSON());

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
  process.exit(1);
}

const rest = new REST().setToken(DISCORD_TOKEN);

// With GUILD_ID set, commands register instantly to that server (good for dev).
// Without it, they register globally (can take up to an hour to appear).
const route = GUILD_ID
  ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
  : Routes.applicationCommands(CLIENT_ID);

const data = await rest.put(route, { body: commands });
console.log(
  `Registered ${data.length} command(s) ${GUILD_ID ? `to guild ${GUILD_ID}` : "globally"}.`
);

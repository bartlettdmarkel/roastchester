# 🔥 Roastchester United

A Discord bot with one job: **roasting Manchester United fans.** Point it at the
United fan in your server and let two decades of material do the talking.

> `/roast @Dave` →
> 🔥 @Dave calls it 'a rebuild year.' It has been a rebuild year since 2013.
> The Sagrada Família went up faster.

## Commands

| Command | What it does |
|---|---|
| `/roast @victim` | Publicly tags the chosen United fan with a random roast from a 40-deep arsenal |
| `/glazernomics` | Drops a devastating fact about the state of the club |
| `/truce` | Toggle roast immunity for yourself (cowardice, but allowed) |

## The rules of engagement

This is **football banter**, the sacred art form. The bot roasts the allegiance —
the Glazers, the trophy drought, the 7-0 at Anfield, the £85m cartwheel merchant —
never the person. No slurs, nothing about anyone's actual life. That's what keeps it
funny, and also what keeps it within [Discord's Community Guidelines](https://discord.com/guidelines).

Built-in guardrails:

- **`/truce`** lets anyone opt out permanently (persisted across restarts)
- **15s cooldown** per roaster, so it's a jab, not a firehose
- Server admins can restrict the commands per-channel/per-role in
  **Server Settings → Integrations** like any slash-command bot

Use it in servers where the banter flows both ways. If your United mate isn't
laughing, that's what `/truce` is for.

## Setup

1. Create an application at the [Discord Developer Portal](https://discord.com/developers/applications),
   add a **Bot**, and copy the token.
2. Under **Installation**, pick *Guild Install* with the `bot` and
   `applications.commands` scopes, and invite it to your server.
3. Clone and configure:

   ```bash
   git clone https://github.com/bartlettdmarkel/roastchester.git
   cd roastchester
   npm install
   cp .env.example .env   # paste in DISCORD_TOKEN, CLIENT_ID, and (optionally) GUILD_ID
   ```

4. Register the slash commands, then start the bot:

   ```bash
   npm run register
   npm start
   ```

That's it. No database, no dashboard, no nonsense. Less infrastructure than
United's entire post-2013 midfield.

## Contributing roasts

The arsenal lives in [`src/roasts.js`](src/roasts.js). PRs welcome — the only
acceptance criteria are:

1. It's about Manchester United, the Glazers, or the general condition of
   supporting them.
2. It's actually funny.
3. It would survive being read aloud in a pub containing at least one United fan
   without anyone calling the police.

## License

MIT. Like United's defending — free for anyone to go through.

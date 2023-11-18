import {
  Client,
  GatewayIntentBits,
  Events,
  ChatInputCommandInteraction,
} from 'discord.js';
import { saveQuote, getRandomQuote, getAuthors } from './db';
import { updateCommands } from './commands';

const { TOKEN } = process.env;
if (!TOKEN) throw new Error('Missing TOKEN environment variable');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log('Ready!');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case 'quote':
      await quote(interaction);
      break;

    case 'addquote':
      await addQuote(interaction);
      break;

    case 'authors':
      await authors(interaction);
      break;
  }
});

await updateCommands();
client.login(TOKEN);

async function quote(interaction: ChatInputCommandInteraction) {
  const author = interaction.options.getString('author');

  const { author: author2, quote } = await getRandomQuote(
    author ? author.toLowerCase() : undefined,
  );

  await interaction.reply({
    content: `"${quote}" - ${author2}`,
  });
}

async function addQuote(interaction: ChatInputCommandInteraction) {
  const author = interaction.options.getString('author');
  const quote = interaction.options.getString('quote');

  if (!(author && quote)) {
    await interaction.reply({
      content: 'Missing author or quote',
      ephemeral: true,
    });
    return;
  }
  await saveQuote(author.toLowerCase(), quote);
  await interaction.reply({
    content: 'Quote saved',
    ephemeral: true,
  });
  await updateCommands();
}

async function authors(interaction: ChatInputCommandInteraction) {
  const authors = await getAuthors();
  await interaction.reply({
    content: authors.join('\n'),
    ephemeral: true,
  });
}

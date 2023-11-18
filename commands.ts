import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';
import { getAuthors } from './db';

const { TOKEN, CLIENT_ID } = process.env;
if (!TOKEN) throw new Error('Missing TOKEN environment variable');
if (!CLIENT_ID) throw new Error('Missing CLIENT_ID environment variable');

const applicationCommandsRoute = Routes.applicationCommands(CLIENT_ID);
const rest = new REST({ version: '10' }).setToken(TOKEN);

export async function updateCommands() {
  const authors = await getAuthors();

  const commands = [
    new SlashCommandBuilder()
      .setName('quote')
      .setDescription('Display a random quote')
      .addStringOption((option) =>
        new SlashCommandStringOption()
          .setName('author')
          .setDescription('The author of the quote')
          .setChoices(
            ...authors.map((author) => ({ name: author, value: author })),
          ),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('addquote')
      .setDescription('Adds a quote')
      .addStringOption((option) =>
        new SlashCommandStringOption()
          .setName('author')
          .setDescription('The author of the quote')
          .setRequired(true),
      )
      .addStringOption((option) =>
        new SlashCommandStringOption()
          .setName('quote')
          .setDescription('The quote')
          .setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('authors')
      .setDescription('List authors')
      .toJSON(),
  ];

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(applicationCommandsRoute, { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

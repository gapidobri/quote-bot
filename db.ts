import { readFile, writeFile } from 'fs/promises';

async function getQuotes() {
  let file = null;
  try {
    file = (await readFile('quotes.json')).toString();
  } catch (e) {}

  const quotes = file ? JSON.parse(file) : {};

  return quotes;
}

export async function saveQuote(author: string, quote: string) {
  const quotes = await getQuotes();

  if (!quotes[author]) {
    quotes[author] = [];
  }

  quotes[author].push(quote);

  await writeFile('quotes.json', JSON.stringify(quotes));
}

export async function getRandomQuote(author?: string) {
  const quotes = await getQuotes();

  if (!author) {
    const authors = Object.keys(quotes);
    author = authors[Math.floor(Math.random() * authors.length)];
  }

  const authorQuotes = quotes[author];
  const quote = authorQuotes[Math.floor(Math.random() * authorQuotes.length)];

  return { author, quote };
}

export async function getAuthors() {
  const quotes = await getQuotes();

  return Object.keys(quotes);
}
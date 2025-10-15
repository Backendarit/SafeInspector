import * as SQLite from 'expo-sqlite';

// open or create database and table
export const init = async () => {
  const db = await SQLite.openDatabaseAsync('safeinspector.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL
    );
  `);
  return db;
};

// Add or update one client
export const addClient = async (client) => {
  const db = await init();
  const statement = await db.prepareAsync(
    'REPLACE INTO clients (id, json) VALUES ($id, $json)'
  );
  try {
    await statement.executeAsync({
      $id: String(client.id),
      $json: JSON.stringify(client),
    });
  } finally {
    await statement.finalizeAsync();
  }
};

// Save all clients at once (used after Azure fetch)
export const saveClients = async (clients) => {
  const db = await init();
  await db.execAsync('DELETE FROM clients;');
  const statement = await db.prepareAsync(
    'INSERT INTO clients (id, json) VALUES ($id, $json)'
  );
  try {
    for (const client of (clients || [])) {
      await statement.executeAsync({
        $id: String(client.id),
        $json: JSON.stringify(client),
      });
    }
  } finally {
    await statement.finalizeAsync();
  }
};

// Read all clients from SQLite
export const fetchAllClients = async () => {
  const db = await init();
  const rows = await db.getAllAsync('SELECT json FROM clients;');
  return rows.map(row => JSON.parse(row.json));
};
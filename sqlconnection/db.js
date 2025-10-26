import * as SQLite from 'expo-sqlite';

// Open or create the local SQLite database and ensure the "clients" table exists
export const init = async () => {
  const db = await SQLite.openDatabaseAsync('safeinspector.db'); // Open database file
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL
    );
  `);
  return db; // Return the database connection
};

// Save all clients to the local database after fetching the latest data from the cloud
export const saveClients = async (clients) => {
  const db = await init(); // Open database connection
  await db.execAsync('DELETE FROM clients;'); // Clear old data before saving
  const statement = await db.prepareAsync(
    'REPLACE INTO clients (id, json) VALUES ($id, $json)' // Insert or update clients
  );
  try {
    for (const client of (clients || [])) {
      await statement.executeAsync({
        $id: String(client.id),     // Use client ID as key
        $json: JSON.stringify(client), // Store client data as JSON string
      });
    }
  } finally {
    await statement.finalizeAsync(); // Close prepared statement
  }
};

// Read all clients from SQLite and return them as JavaScript objects
export const fetchAllClients = async () => {
  const db = await init(); // Open database connection
  const rows = await db.getAllAsync('SELECT json FROM clients;'); //Read all rows
  return rows.map(row => JSON.parse(row.json)); //Convert JSON strings back to objects that we can use
};
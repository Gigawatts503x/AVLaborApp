import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'labor_coordinator.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Query wrapper with logging
export const query = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (error) {
    console.error('❌ Query Error:', sql, params);
    throw error;
  }
};

// Single row query
export const queryOne = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  } catch (error) {
    console.error('❌ Query One Error:', sql, params);
    throw error;
  }
};

// Execute query (INSERT, UPDATE, DELETE)
export const execute = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return result;
  } catch (error) {
    console.error('❌ Execute Error:', sql, params);
    throw error;
  }
};

// Transaction support
export const transaction = (callback) => {
  const begin = db.prepare('BEGIN');
  const commit = db.prepare('COMMIT');
  const rollback = db.prepare('ROLLBACK');

  try {
    begin.run();
    const result = callback();
    commit.run();
    return result;
  } catch (error) {
    rollback.run();
    throw error;
  }
};

// Initialize database
export const initializeDatabase = () => {
  console.log('🗄️  Initializing database...');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      clientname TEXT,
      clientcontact TEXT,
      clientphone TEXT,
      clientemail TEXT,
      clientaddress TEXT,
      ponumber TEXT,
      startdate TEXT,
      enddate TEXT,
      totaltechpayout REAL DEFAULT 0,
      totallaborcost REAL DEFAULT 0,
      totalcustomerbilling REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS technicians (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      phone TEXT,
      email TEXT,
      ratetype TEXT CHECK(ratetype IN ('hourly', 'half-day', 'full-day')),
      techhourlyrate REAL,
      techhalfdayrate REAL,
      techfulldayrate REAL,
      billhourlyrate REAL,
      billhalfdayrate REAL,
      billfulldayrate REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS eventrequirements (
      id TEXT PRIMARY KEY,
      eventid TEXT NOT NULL,
      requirementdate TEXT,
      requirementenddate TEXT,
      roomorlocation TEXT,
      settime TEXT,
      starttime TEXT NOT NULL,
      endtime TEXT NOT NULL,
      striketime TEXT,
      position TEXT,
      techsneeded INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(eventid) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS eventassignments (
      id TEXT PRIMARY KEY,
      eventid TEXT NOT NULL,
      technicianid TEXT NOT NULL,
      requirementid TEXT,
      position TEXT,
      roomorlocation TEXT,
      hoursworked REAL,
      basehours REAL,
      othours REAL,
      dothours REAL,
      ratetype TEXT,
      techhourlyrate REAL,
      techhalfdayrate REAL,
      techfulldayrate REAL,
      billhourlyrate REAL,
      billhalfdayrate REAL,
      billfulldayrate REAL,
      calculatedpay REAL,
      customerbill REAL,
      notes TEXT,
      assignmentdate TEXT,
      starttime TEXT,
      endtime TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(eventid) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY(technicianid) REFERENCES technicians(id) ON DELETE CASCADE,
      FOREIGN KEY(requirementid) REFERENCES eventrequirements(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      halfdayhours INTEGER DEFAULT 5,
      fulldayhours INTEGER DEFAULT 10,
      otthreshold INTEGER DEFAULT 10,
      dotthreshold INTEGER DEFAULT 20,
      dotstarthour INTEGER DEFAULT 20,
      techbaserate REAL DEFAULT 50,
      customerbaserate REAL DEFAULT 75,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_eventassignments_eventid ON eventassignments(eventid);
    CREATE INDEX IF NOT EXISTS idx_eventassignments_technicianid ON eventassignments(technicianid);
    CREATE INDEX IF NOT EXISTS idx_eventrequirements_eventid ON eventrequirements(eventid);
  `);

  console.log('✅ Database tables created');

  // Initialize settings if empty
  const settingsExists = queryOne('SELECT COUNT(*) as count FROM settings');
  if (settingsExists.count === 0) {
    execute(
      `INSERT INTO settings (id, halfdayhours, fulldayhours, otthreshold, dotthreshold, dotstarthour, techbaserate, customerbaserate)
       VALUES (1, 5, 10, 10, 20, 20, 50, 75)`
    );
    console.log('✅ Default settings initialized');
  }

  // Seed default positions if empty
  const positionsExists = queryOne('SELECT COUNT(*) as count FROM positions');
  if (positionsExists.count === 0) {
    const defaultPositions = [
      'Audio Technician',
      'Camera Operator',
      'Lighting Technician',
      'Stage Manager',
      'Grip',
      'Gaffer',
      'Video Producer',
      'Production Assistant'
    ];
    
    defaultPositions.forEach(position => {
      try {
        execute('INSERT INTO positions (name) VALUES (?)', [position]);
      } catch (error) {
        // Position already exists, skip
      }
    });
    console.log('✅ Default positions seeded');
  }
};

export default db;

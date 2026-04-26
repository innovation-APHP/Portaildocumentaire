import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedData = await fs.readFile(seedPath, 'utf-8');

    console.log('📝 Inserting demo data...');
    await pool.query(seedData);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();

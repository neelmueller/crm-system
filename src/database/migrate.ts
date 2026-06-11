import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { query } from "../config/database";

async function migrate() {
    await query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            executed_at TIMESTAMPTZ DEFAULT NOW()
        )
    `, []);

    const excutedRows = await query<{ filename: string }>(
        'SELECT filename FROM schema_migrations',
        []
    );

    const executedMigrations = new Set(
        excutedRows.map(row => row.filename)
    );

    try {
        const __dirname = path.dirname(__filename);
        const migrationsPath = path.join(__dirname, '../../src/database/migrations');
        const file = await fs.readdir(migrationsPath);
        const sqlFile = file.filter(f => f.endsWith('.sql'));
        const sortedSql = sqlFile.sort();

        for (const datei of sortedSql) {
            if (executedMigrations.has(datei)) {
                console.log('Migration schon ausgeführt:', datei);
                continue;
            }

            const inhalt = await fs.readFile(path.join(migrationsPath, datei), 'utf-8');

            await query(inhalt, []);

            await query(
                'INSERT INTO schema_migrations(filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
                [datei]
            );

            console.log('Migration ausgeführt:', datei);
        }

        console.log(sortedSql);
    } catch (err) {
        console.error(err);
    }

    console.log('schema_migrations Tabelle bereit');
}

migrate()
;
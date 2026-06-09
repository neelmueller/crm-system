import pg from 'pg';
import {config} from './env';
const { Pool } = pg;

export const pool = new Pool({
    connectionString: config.database_url,
});
pool.on('error', (err) => {
    console.error('Unexpected error', err)
});
export async function query<T>(sql: string, params: any[] = []): Promise<T[]>{
    const res = await pool.query(sql,params)
    return res.rows;
}
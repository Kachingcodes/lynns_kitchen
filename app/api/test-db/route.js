import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        current_schema() AS schema
    `);

    const dbUrl = new URL(process.env.DATABASE_URL);

    return NextResponse.json({
      database: result.rows[0].database,
      user: result.rows[0].user,
      schema: result.rows[0].schema,
      host: dbUrl.hostname,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        inet_server_addr() AS server
    `);

    const url = process.env.DATABASE_URL;

    return NextResponse.json({
      envHost: url
        ? new URL(url).hostname
        : "DATABASE_URL is missing",
      database: result.rows[0].database,
      user: result.rows[0].user,
      server: result.rows[0].server,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      envHost: process.env.DATABASE_URL
        ? new URL(process.env.DATABASE_URL).hostname
        : "DATABASE_URL is missing",
    });
  }
}
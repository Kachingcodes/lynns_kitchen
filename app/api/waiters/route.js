import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        phone,
        shift_schedule
      FROM waiter
      WHERE restaurant_id = 3
      ORDER BY name ASC
    `);

    return NextResponse.json({
      waiters: result.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching waiters:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch waiters",
      },
      {
        status: 500,
      }
    );
  }
}
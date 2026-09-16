import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        specialty,
        phone

      FROM chef

      WHERE restaurant_id = 3

      ORDER BY name ASC
      `
    );

    return NextResponse.json({
      chefs: result.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching chefs:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch chefs",
      },
      {
        status: 500,
      }
    );
  }
}
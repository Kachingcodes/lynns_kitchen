import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT unnest(enum_range(NULL::order_status))::text AS status
    `);

    const statuses = result.rows.map(
      (row) => row.status
    );

    return NextResponse.json({
      statuses,
    });

  } catch (error) {
    console.error(
      "Error loading order statuses:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load order statuses",
      },
      {
        status: 500,
      }
    );
  }
}
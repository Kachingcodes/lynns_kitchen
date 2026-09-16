import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.table_number,
        o.status,
        o.order_datetime,
        o.estimated_wait_minutes,
        o.actual_wait_minutes,
        o.preparing_started_at,
        o.waiter_id,

        c.name AS customer_name,

        w.name AS waiter_name,

        comp.id AS complaint_id,
        comp.description AS complaint_description,
        comp.resolution_status AS complaint_status,
        comp.submitted_at AS complaint_submitted_at,
        comp.resolved_at AS complaint_resolved_at,
        comp.resolved_by_waiter_id,

        r.id AS rating_id,
        r.rating_value,
        r.comment AS rating_comment,
        r.submitted_at AS rating_submitted_at

      FROM orders o

      JOIN customer c
        ON c.id = o.customer_id

      LEFT JOIN waiter w
        ON w.id = o.waiter_id

      LEFT JOIN complaint comp
        ON comp.order_id = o.id

      LEFT JOIN rating r
        ON r.order_id = o.id

        WHERE o.restaurant_id = 3

      ORDER BY
        CASE
          WHEN o.status = 'paid' THEN 1
          ELSE 0
        END ASC,

        o.order_datetime DESC
    `);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error(
      "Error fetching waiter orders:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}
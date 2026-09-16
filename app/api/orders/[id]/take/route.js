import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function PATCH(request, { params }) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const body = await request.json();

    const { waiterId } = body;

    if (!waiterId) {
      return NextResponse.json(
        {
          error: "Waiter is required",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    /*
      First check that the waiter exists.
    */
    const waiterResult = await client.query(
      `
      SELECT id, name
      FROM waiter
      WHERE id = $1
        AND restaurant_id = 3
      `,
      [waiterId]
    );

    if (waiterResult.rows.length === 0) {
      throw new Error("Waiter not found");
    }

    /*
      Claim the order.

      IMPORTANT:
      waiter_id IS NULL ensures that two waiters
      cannot successfully take the same order.
    */
    const orderResult = await client.query(
      `
      UPDATE orders
      SET waiter_id = $1

      WHERE id = $2
        AND waiter_id IS NULL
        AND restaurant_id = 3

      RETURNING
        id,
        waiter_id,
        table_number,
        status,
        estimated_wait_minutes
      `,
      [waiterId, id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error(
        "This order has already been taken by another waiter"
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Order successfully assigned",

      order: orderResult.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error assigning waiter:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to take order",
      },
      {
        status: 500,
      }
    );

  } finally {
    client.release();
  }
}
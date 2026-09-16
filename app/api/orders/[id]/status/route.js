import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          error: "Status is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
      Get the current order first.
    */

    const orderResult = await pool.query(
      `
        SELECT
          id,
          status,
          chef_id,
          bartender_id
        FROM orders
        WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const order = orderResult.rows[0];


    /*
      Update status.

      PostgreSQL will automatically validate
      against the order_status enum.
    */

    const result = await pool.query(
      `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING *
      `,
      [status, id]
    );

    return NextResponse.json({
      order: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Error updating order status:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update order status",
      },
      {
        status: 500,
      }
    );
  }
}
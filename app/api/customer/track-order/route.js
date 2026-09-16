import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const tableNumber = body.tableNumber?.trim();

    /*
      VALIDATION
    */

    if (!name || !tableNumber) {
      return NextResponse.json(
        {
          error:
            "Please enter your name and table number",
        },
        {
          status: 400,
        }
      );
    }

    /*
      FIND THE MOST RECENT ORDER

      Match:
      - Customer name
      - Table number
    */

    const result = await pool.query(
      `
        SELECT
          o.id,
          o.table_number,
          o.status,
          o.order_datetime,

          c.name AS customer_name

        FROM orders o

        JOIN customer c
          ON c.id = o.customer_id

        WHERE
          LOWER(TRIM(c.name)) =
          LOWER(TRIM($1))

          AND o.table_number = $2

        ORDER BY
          o.order_datetime DESC

        LIMIT 1
      `,
      [
        name,
        tableNumber,
      ]
    );

    /*
      ORDER NOT FOUND
    */

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "We couldn't find an order matching that name and table number.",
        },
        {
          status: 404,
        }
      );
    }

    /*
      SUCCESS
    */

    const order = result.rows[0];

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(
      "Error tracking order:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while looking for your order.",
      },
      {
        status: 500,
      }
    );
  }
}
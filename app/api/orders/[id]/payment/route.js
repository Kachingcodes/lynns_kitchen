import { NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function POST(request, { params }) {

  const client = await pool.connect();


  try {

    const { id } = await params;

    const body = await request.json();

    const {
      waiterId,
      method,
    } = body;


    await client.query("BEGIN");


    /*
      Get the order and calculate
      the real total from the database.
    */

    const orderResult = await client.query(
      `
      SELECT
        o.id,
        o.waiter_id,
        o.status,
        o.restaurant_id,

        COALESCE(
          SUM(
            oi.quantity *
            oi.unit_price_naira
          ),
          0
        ) AS total_amount

      FROM orders o

      JOIN order_item oi
        ON oi.order_id = o.id

      WHERE o.id = $1

      GROUP BY
        o.id
      `,
      [Number(id)]
    );


    if (orderResult.rows.length === 0) {

      throw new Error(
        "Order not found"
      );

    }


    const order =
      orderResult.rows[0];


    /*
      Only served orders can be paid.
    */

    if (order.status !== "served") {

      throw new Error(
        "Only served orders can be paid"
      );

    }


    /*
      Make sure we have a waiter.
    */

    const receivedByWaiterId =
      Number(waiterId) ||
      order.waiter_id;


    if (!receivedByWaiterId) {

      throw new Error(
        "Waiter information is required"
      );

    }


    /*
      Create payment.

      is_pretend is ALWAYS TRUE.
    */

    const paymentResult =
      await client.query(
        `
        INSERT INTO payment (

          order_id,

          received_by_waiter_id,

          amount_naira,

          method,

          status,

          is_pretend

        )

        VALUES (

          $1,

          $2,

          $3,

          $4,

          'completed',

          TRUE

        )

        RETURNING *
        `,
        [

          order.id,

          receivedByWaiterId,

          order.total_amount,

          method || "cash",

        ]
      );


    /*
      Update the order.

      Status becomes PAID.
    */

    const updatedOrderResult =
      await client.query(
        `
        UPDATE orders

        SET
          status = 'paid'

        WHERE id = $1

        RETURNING *
        `,
        [order.id]
      );


    await client.query("COMMIT");


    return NextResponse.json({

      message:
        "Payment completed successfully",

      payment:
        paymentResult.rows[0],

      order:
        updatedOrderResult.rows[0],

    });


  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Error processing payment:",
      error
    );


    return NextResponse.json(

      {
        error:
          error.message ||
          "Failed to process payment",
      },

      {
        status: 500,
      }

    );


  } finally {

    client.release();

  }

}
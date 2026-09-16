import { NextResponse } from "next/server";
import pool from "../../lib/db";


export async function POST(request) {

  try {

    const body = await request.json();

    const {
      orderId,
      customerId,
      ratingValue,
      comment,
    } = body;


    if (!orderId) {

      return NextResponse.json(
        {
          error: "Order is required",
        },
        {
          status: 400,
        }
      );

    }


    if (!customerId) {

      return NextResponse.json(
        {
          error: "Customer is required",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !ratingValue ||
      ratingValue < 1 ||
      ratingValue > 5
    ) {

      return NextResponse.json(
        {
          error:
            "Please select a rating between 1 and 5",
        },
        {
          status: 400,
        }
      );

    }


    const result = await pool.query(

      `
      INSERT INTO rating (
        order_id,
        customer_id,
        rating_value,
        comment
      )
      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,

      [
        orderId,
        customerId,
        ratingValue,
        comment?.trim() || null,
      ]

    );


    return NextResponse.json(
      {

        message:
          "Thank you for your rating!",

        rating:
          result.rows[0],

      },

      {
        status: 201,
      }

    );


  } catch (error) {

    console.error(
      "Error submitting rating:",
      error
    );


    /*
      PostgreSQL unique constraint error.

      This prevents duplicate ratings
      for the same order.
    */

    if (error.code === "23505") {

      return NextResponse.json(
        {
          error:
            "This order has already been rated",
        },
        {
          status: 409,
        }
      );

    }


    return NextResponse.json(
      {
        error:
          "Failed to submit rating",
      },
      {
        status: 500,
      }
    );

  }

}
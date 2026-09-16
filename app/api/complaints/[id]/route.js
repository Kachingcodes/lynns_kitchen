import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      resolutionStatus,
      waiterId,
    } = body;

    if (!resolutionStatus) {
      return NextResponse.json(
        {
          error:
            "Resolution status is required",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !["open", "resolved"].includes(
        resolutionStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid complaint status",
        },
        {
          status: 400,
        }
      );
    }


const result = await pool.query(
  `
  UPDATE complaint

  SET
    resolution_status = $1::complaint_status,

    resolved_by_waiter_id =
      CASE
        WHEN $1::complaint_status = 'resolved'::complaint_status
        THEN $2::integer
        ELSE NULL
      END,

    resolved_at =
      CASE
        WHEN $1::complaint_status = 'resolved'::complaint_status
        THEN NOW()
        ELSE NULL
      END

  WHERE id = $3::integer

  RETURNING *
  `,
  [
    resolutionStatus,
    waiterId || null,
    id,
  ]
);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Complaint not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      message:
        resolutionStatus === "resolved"
          ? "Complaint resolved successfully"
          : "Complaint reopened successfully",

      complaint: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Error updating complaint:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to update complaint",
      },
      {
        status: 500,
      }
    );
  }
}
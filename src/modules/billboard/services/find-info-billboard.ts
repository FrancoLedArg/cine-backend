import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findInfoBillboard = async () => {
  try {
    const billboard = await db.query.infoSlides.findMany();

    if (!billboard) {
      throw new DatabaseError("Info billboard not found");
    }

    return billboard;
  } catch (error: unknown) {
    if (error instanceof DatabaseError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the info billboard",
    );
  }
};

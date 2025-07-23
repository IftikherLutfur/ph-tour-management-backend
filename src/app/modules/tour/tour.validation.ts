import z from "zod";

export const tourValidation = z.object({
 title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  costForm: z.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.string().optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  division: z.string().min(1, "Division ID is required"), // ObjectId as string
  tourType: z.string().min(1, "Tour type ID is required") // ObjectId as string
})
import z from "zod";

export const divisionZodSchem = z.object({
    name: z.string({invalid_type_error:"Division name must be string"}).min(2).max(30),
    slug: z.string({invalid_type_error: "slug name must be string"}).optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional()
})

export const divisionZodUpdateSchem = z.object({
    name: z.string({invalid_type_error:"Division name must be string"}).min(2).max(30).optional(),
    slug: z.string({invalid_type_error: "slug name must be string"}).optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional()
})
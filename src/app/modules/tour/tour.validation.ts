import z from "zod";

export const tourValidation = z.object({
title : z.string().min(2),
slug : z.string().optional(),
description : z.string().optional(),
images : z.string().optional(),
location : z.string().optional(),
costForm : z.string().optional(),
startDate : z.string().optional(),
endDate : z.string().optional(),
included : z.string().optional(),
excluded : z.string().optional(),
amenities : z.string().optional(),
tourPlan : z.string().optional(),
maxGuest : z.string().optional(),
minAge : z.string().optional(),
division : z.string().optional(),
tourType : z.string().optional(),
})
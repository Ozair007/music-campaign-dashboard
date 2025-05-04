import { z } from 'zod';
import { isAfter, parseISO } from 'date-fns';

export const CampaignSchema = z.object({
	title: z.string().min(1, "Title is required").max(100),
	brand: z.string().min(1, "Brand is required").max(50),
	start_date: z.string()
	  .refine(val => !isNaN(new Date(val).getTime()), "Invalid start date"),
	end_date: z.string()
	  .refine(val => !isNaN(new Date(val).getTime()), "Invalid end date"),
	budget: z.number().min(0, "Budget must be positive"),
	description: z.string().max(500).optional(),
	image_url: z.union([
		z.string().url(),
		z.literal(''),
		z.undefined()
	  ]).optional(),
}).superRefine((data, ctx) => {
	try {
	  const start = parseISO(data.start_date);
	  const end = parseISO(data.end_date);
  
	  if (!isAfter(end, start)) {
		ctx.addIssue({
		  code: z.ZodIssueCode.custom,
		  message: "End date must be after start date",
		  path: ["end_date"]
		});
	  }
	} catch {
	  ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Invalid date format",
		path: ["end_date"]
	  });
	}
});
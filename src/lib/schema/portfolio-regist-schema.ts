import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const portfolioImageSchema = z.object({
  images: z
    .array(
      z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'Each file must be less than 10MB',
      }),
    )
    .min(1, 'At least one file is required.')
    .max(10, 'You can upload up to 10 images.'),
});

export const portfolioInfoSchema = z.object({
  title: z.string().min(2).max(42),
  detail: z.string().or(z.literal('')).optional(),
  tagList: z.array(z.string()).min(0).max(5).nullable().optional(),
  togather: z.string().or(z.literal('')).optional(),
});

export type PortfolioImageFormValues = z.infer<typeof portfolioImageSchema>;
export type PortfolioDetailFormValues = z.infer<typeof portfolioInfoSchema>;

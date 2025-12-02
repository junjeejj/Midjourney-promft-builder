import { z } from "zod";

export const GeneratePromptSchema = z.object({
  subject: z.string().min(1).max(500),
  params: z.object({
    ar: z.string().regex(/^\d+:\d+$/).optional(),
    style: z.string().max(50).optional(),
    stylize: z.number().min(0).max(1000).optional(),
    chaos: z.number().min(0).max(100).optional(),
    q: z.number().min(0.25).max(2).optional(),
    seed: z.number().int().min(0).max(4_294_967_295).optional(),
    tile: z.boolean().optional(),
    niji: z.boolean().optional(),
    sref: z.string().max(200).optional(),
    cref: z.string().max(200).optional(),
    no: z.array(z.string().min(1).max(50)).max(20).optional(),
    stop: z.number().min(10).max(100).optional(),
    repeat: z.number().min(1).max(4).optional(),
    version: z.string().regex(/^(\d+(\.\d+)?)$/).optional(),
  }).partial().default({}),
});

export type GeneratePromptInput = z.infer<typeof GeneratePromptSchema>;


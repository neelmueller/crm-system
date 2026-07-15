import { z } from "zod";


export const createAppointmentSchema = z.object({
    title: z.string().min(1, "Titel darf nicht leer sein"),
    description: z.string(),
    scheduled_at: z.coerce.date(), 
    duration_minutes: z.number().int().positive()
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;


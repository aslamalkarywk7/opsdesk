// Shared Zod contracts (single source of truth for validation).
// AppointmentSchema: create/update payload. StatsSchema: /api/stats output.
// StatusChangeSchema: { id, status } for /api/appointments/status.
// TRANSITIONS: legal status graph; STAFF rule (scheduled->checked_in only) is
// enforced in the status route + documented in docs/ROLES.md.
import { z } from "zod";

export const AppointmentStatus = z.enum(["scheduled", "checked_in", "completed", "cancelled"]);
export type AppointmentStatus = z.infer<typeof AppointmentStatus>;

export const AppointmentSchema = z.object({
  id: z.string().min(1),
  patient: z.string().min(2).max(80),
  doctor: z.string().min(2).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  status: AppointmentStatus
});
export type Appointment = z.infer<typeof AppointmentSchema>;

export const StatsSchema = z.object({
  todayAppointments: z.number().int().nonnegative(),
  lowStock: z.number().int().nonnegative(),
  pendingOrders: z.number().int().nonnegative(),
  revenueMonth: z.number().nonnegative()
});
export type Stats = z.infer<typeof StatsSchema>;

export const StatusChangeSchema = z.object({
  id: z.string().min(1),
  status: AppointmentStatus
});
export type StatusChange = z.infer<typeof StatusChangeSchema>;

// Allowed transitions. STAFF may only perform scheduled -> checked_in.
export const TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ["checked_in", "completed", "cancelled"],
  checked_in: ["completed", "cancelled"],
  completed: [],
  cancelled: []
};

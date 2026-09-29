import type { Appointment, Stats } from "./schemas";

export const stats: Stats = {
  todayAppointments: 24,
  lowStock: 7,
  pendingOrders: 13,
  revenueMonth: 48250
};

export const appointments: Appointment[] = [
  { id: "A-1041", patient: "Mona Adel", doctor: "Dr. Hany", date: "2026-09-30", time: "09:00", status: "scheduled" },
  { id: "A-1042", patient: "Karim Samy", doctor: "Dr. Laila", date: "2026-09-30", time: "09:30", status: "checked_in" },
  { id: "A-1043", patient: "Sara Nabil", doctor: "Dr. Hany", date: "2026-09-30", time: "10:00", status: "completed" },
  { id: "A-1044", patient: "Omar Fathy", doctor: "Dr. Mazen", date: "2026-09-30", time: "10:30", status: "scheduled" },
  { id: "A-1045", patient: "Huda Ali", doctor: "Dr. Laila", date: "2026-09-30", time: "11:00", status: "cancelled" },
  { id: "A-1046", patient: "Peter Magdy", doctor: "Dr. Mazen", date: "2026-09-30", time: "11:30", status: "scheduled" }
];

export function filterAppointments(q: string): Appointment[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return appointments;
  return appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(needle) ||
      a.doctor.toLowerCase().includes(needle) ||
      a.id.toLowerCase().includes(needle)
  );
}

export function setAppointmentStatus(id: string, status: Appointment["status"]): Appointment | null {
  const row = appointments.find((a) => a.id === id);
  if (!row) return null;
  row.status = status;
  return row;
}

export interface StockItem {
  sku: string;
  name: string;
  qty: number;
  min: number;
}

export const inventory: StockItem[] = [
  { sku: "MED-001", name: "Syringes 5ml", qty: 42, min: 100 },
  { sku: "MED-014", name: "Gloves (box)", qty: 18, min: 50 },
  { sku: "MED-022", name: "Bandages", qty: 9, min: 30 },
  { sku: "MED-031", name: "Antiseptic 500ml", qty: 25, min: 40 },
  { sku: "MED-040", name: "Thermometers", qty: 6, min: 15 },
  { sku: "MED-052", name: "Masks N95", qty: 60, min: 200 },
  { sku: "MED-063", name: "IV lines", qty: 11, min: 25 }
];

export function lowStockItems(): StockItem[] {
  return inventory.filter((i) => i.qty <= i.min);
}

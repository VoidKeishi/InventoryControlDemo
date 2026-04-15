import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: vi });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

/**
 * Utilidades para manejo de fechas
 */

/**
 * Obtiene el inicio de la semana (lunes) para una fecha dada
 * @param {Date} date - Fecha (por defecto hoy)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

/**
 * Obtiene el fin de la semana (domingo) para una fecha dada
 * @param {Date} date - Fecha (por defecto hoy)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function getEndOfWeek(date = new Date()) {
  const start = getStartOfWeek(date);
  const sunday = new Date(start);
  sunday.setDate(sunday.getDate() + 6);
  return sunday.toISOString().split("T")[0];
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function getTodayKey() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha a formato corto DD/MM/YYYY
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDateShort(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha a clave YYYY-MM-DD
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function formatDateToKey(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene el nombre del día de la semana
 * @param {string|Date} date - Fecha
 * @returns {string} Nombre del día
 */
export function getDayName(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[d.getDay()];
}
/**
 * Formats a standardized, professional Student ID from user ID
 * Example: ID 5 -> "TSAR-2026-00005"
 */
export const formatStudentId = (id) => {
    if (!id) return "TSAR-2026-00001";
    const numericId = parseInt(id, 10) || 1;
    return `TSAR-2026-${String(numericId).padStart(5, '0')}`;
};

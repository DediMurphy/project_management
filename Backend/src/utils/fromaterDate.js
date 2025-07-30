// export const formatDateToYYYYMMDD = (date) => {
//   if (!date) return null;
  
//   const dateObj = date instanceof Date ? date : new Date(date);
//   return dateObj.toISOString().split('T')[0];
// };

export function toYMD(dateInput) {
  if (!dateInput) return null;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date)) return null;
  return date.toISOString().split('T')[0];
}


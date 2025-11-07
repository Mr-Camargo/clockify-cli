// Formats date in "MMM DD" format. Includes YYYY if the year is not the current year.

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (year !== currentYear) {
    return `${day.toString().padStart(2, '0')} ${monthNames[month - 1]}, ${year}`;
  }

  return `${day.toString().padStart(2, '0')} ${monthNames[month - 1]}`;
}

export default formatDate;

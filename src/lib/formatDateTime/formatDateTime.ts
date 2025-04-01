interface FormatDateTimeResults {
  dateTime: string;
  date: string;
  time: string;
}

export const formatDateTime = (input: any): FormatDateTimeResults => {
  const date = new Date(input);

  // Check if the date is invalid
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date provided: ${input}`);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const isPM = hours >= 12;
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours}:${minutes} ${isPM ? 'PM' : 'AM'}`;

  return {
    dateTime: `${year}-${month}-${day}, ${formattedTime}`,
    date: `${year}-${month}-${day}`,
    time: formattedTime,
  };
};

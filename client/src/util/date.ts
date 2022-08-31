const formatDateTimestamp = (timestamp: string, format: "small" | "big") => {
  const date = parseInt(timestamp);
  return format === "small"
    ? new Date(date).toLocaleDateString()
    : new Date(date).toDateString();
};

export { formatDateTimestamp };

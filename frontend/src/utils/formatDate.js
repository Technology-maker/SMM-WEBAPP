const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(date))
    : "-";

export default formatDate;

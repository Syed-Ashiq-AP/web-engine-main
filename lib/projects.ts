import { formatDistanceToNow } from "date-fns";

export const sinceDate = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });

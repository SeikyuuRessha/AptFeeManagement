import { Frequency } from '../enums';

export default function calcNextBillingDate(frequency: string, date: Date) {
  switch (frequency) {
    case Frequency.MONTHLY:
      date.setMonth(date.getMonth() + 1);
      break;
    case Frequency.QUARTERLY:
      date.setMonth(date.getMonth() + 3);
      break;
    case Frequency.YEARLY:
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      // leave date unchanged
      break;
  }

  return date;
}

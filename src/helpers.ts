export const getDateDifference = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};

export function adjustBills(bill1: number, bill2: number) {
  const [highBill, lowBill] = bill1 >= bill2 ? [bill1, bill2] : [bill2, bill1];

  const highRounded = Math.floor(highBill); // Remove fraction
  const fraction = highBill - highRounded; // Extract fraction
  const adjustedLow = parseFloat((lowBill + fraction).toFixed(2)); // Add fraction to low bill

  return bill1 >= bill2
    ? { adjustedBill1: highRounded, adjustedBill2: adjustedLow }
    : { adjustedBill1: adjustedLow, adjustedBill2: highRounded };
}

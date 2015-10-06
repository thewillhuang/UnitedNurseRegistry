const returnPay = (pay) => {
  const w2 = 0.33;
  const forW2 = pay * (1 - w2);
  return forW2.toFixed(2);
};
export default returnPay;

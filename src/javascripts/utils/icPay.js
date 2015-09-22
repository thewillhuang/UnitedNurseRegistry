const returnPay = (pay) => {
  const ic = 0.08;
  const forIc = pay * (1 - ic);
  return forIc.toFixed(2);
};
export default returnPay;

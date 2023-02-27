export const checkingOfDigitsAfterComa = (
  rateOfCurrency: number,
) => {
  return rateOfCurrency < 0.01
   ? rateOfCurrency
   : +rateOfCurrency.toFixed(2);
}

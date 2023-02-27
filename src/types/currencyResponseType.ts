import type { Rates } from "./ratesType";

export interface CurrencyResponseType {
  base: string,
  date: string,
  rates: Rates,
}
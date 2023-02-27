const url = 'https://api.currencyfreaks.com/latest?apikey=2607db4c3a714428a631c70071f59991'

import type { CurrencyResponseType } from "@/types/currencyResponseType";

export async function getData<T>(urlToApi: string): Promise<T> {
  const data = await fetch(urlToApi);

  return data.json();
}

export async function getMoney() {
  try {
    const data = await getData<CurrencyResponseType>(url);

    return data.rates;
  } catch (error) {
    throw new Error('something went wrong!')
  }
}
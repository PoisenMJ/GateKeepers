const ShippingPrices = {
  'United Kingdom': 0.0,
  France: 15.2,
  Italy: 18,
  Netherlands: 13.6,
  'United States': 22.4,
  Austria: 16.3,
  Canada: 24.9,
  Germany: 13.1,
  'Hong Kong': 13.4,
  Singapore: 18.2,
  'South Korea': 17.8,
};

const ShippingCountries = [
  'United Kingdom',
  'United States',
  'Canada',
  'Germany',
  'France',
  'Spain',
  'China',
  'Hong Kong',
  'Japan',
  'Taiwan',
  'Netherlands',
  'Sweden',
  'Denmark',
  'Austria',
  'Australia',
  'New Zealand',
  'India',
  'Poland',
  'Russia',
  'Italy',
  'Finland',
  'Norway',
  'Scotland',
];

const GetShippingPrice = (country) => ShippingPrices[country];

export { GetShippingPrice, ShippingCountries };

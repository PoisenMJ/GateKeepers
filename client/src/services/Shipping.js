import React, { useState, useEffect, useContext } from 'react';

const ExchangeRates = {
    GB: 1.0,
    EU: 1.2 ,
    US: 1.36
}

const ShippingPrices = {
    'united-kingdom': 5.4,
    'france': 15.2,
    'italy': 18,
    'netherlands': 13.6,
    'united-states': 22.4,
    'austria': 16.3,
    'canada': 24.9,
    'germany': 13.1,
    'hong-kong': 13.4,
    'singapore': 18.2,
    'south-korea': 17.8,

}

const GetShippingPrice = (country) => ShippingPrices[country];

export { GetShippingPrice }
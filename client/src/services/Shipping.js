import React, { useState, useEffect, useContext } from 'react';

const ExchangeRates = {
    GB: 1.0,
    EU: 1.2 ,
    US: 1.36
}

const ShippingPrices = {
    'united-kingdom': 5.39,
    'france': 15.14,
    'italy': 17.93,
    'netherlands': 13.59,
    'united-states': 22.38,
    'austria': 16.30,
    'canada': 24.84,
    'germany': 13.09,
    'hong-kong': 13.32,
    'singapore': 18.14,
    'south-korea': 17.73,

}

const GetShippingPrice = (country) => ShippingPrices[country];

export { GetShippingPrice }
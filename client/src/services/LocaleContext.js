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

const ConvertPrice = (newLocale, price) => {
    return parseInt(price * ExchangeRates[newLocale]);
}

const GetShippingPrice = (country) => ShippingPrices[country];

const LocaleContext = React.createContext({
    locale: null,
    currency: null,
    setLocale: (data) => { }
});

const LocaleProvider = ({ children }) => {
    const localLocale = localStorage.getItem('locale') || 'GB';
    const localCurrency = localStorage.getItem('currency') || '£';
    const [locale, setLocale] = useState(localLocale);
    const [currency, setCurrency] = useState(localCurrency);

    useEffect(() => {
        if(locale === 'EU') setCurrency('€');
        else if(locale === 'US') setCurrency('$');
        else if(locale === 'GB') setCurrency('£');
        localStorage.setItem('locale', locale);
        localStorage.setItem('currency', currency);
    }, [locale]);

    return (
        <LocaleContext.Provider value={{
            locale: locale,
            currency: currency,
            setLocale: setLocale
        }}>
            {children}
        </LocaleContext.Provider>
    )
}

export { LocaleProvider, LocaleContext, ConvertPrice, GetShippingPrice }
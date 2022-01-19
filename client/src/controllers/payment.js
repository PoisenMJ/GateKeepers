async function getCheckoutUrl(products, username){
    var res = await fetch('/payment/checkout',{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({products, username})
    });
    var json = await res.json();
    return json.url;
}

async function getSessionData(sessionID, username ){
    var res = await fetch('/payment/session-data',{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionID, username })
    })
    var json = await res.json();
    return json;
}

async function decrementProductBeforeCheckout(urisAndNames){
    var res = await fetch('/payment/check-products', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: urisAndNames })
    });
    var json = await res.json();
    return { outOfStock: json.outOfStock, name: json.name }
}

async function saveOrder(customerID, orderID, items, total, username){
    var res = await fetch('/payment/save-order', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orderID,
            customerID,
            items,
            username,
            date: new Date(),
            total
        })
    });
    var json = await res.json();
    return json;
}

async function cancelOrder(items){
    var res = await fetch('/payment/cancel-order', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
    });
    var json = await res.json();
    return json;
}

export { getCheckoutUrl, getSessionData, saveOrder, decrementProductBeforeCheckout, cancelOrder };
import Order from '../models/order';
import CreatorProduct from '../models/creatorProduct';

async function getCheckoutUrl(products){
    var res = await fetch('/payment/checkout',{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({products})
    });
    var json = await res.json();
    return json.url;
}

async function getSessionData(sessionID){
    var res = await fetch('/payment/session-data',{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionID })
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
    var order = new Order({
        orderID,
        items,
        date: new Date().toString(),
        total,
        customerID,
        username
    });

    for(var i = 0; i < items.length; i++){
        // CreatorProduct.updateOne({ uri: items[i], count: { $gt: 0 } }, { $inc: { count: -1 }}).then((updated, err) => {
        //     if(!updated)
        // })
    }

    try{
        await order.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

export { getCheckoutUrl, getSessionData, saveOrder, decrementProductBeforeCheckout };
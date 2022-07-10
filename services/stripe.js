const stripe = require('stripe')(process.env.STRIPE_DEV_KEY);
const User = require('../models/user');

module.exports.createSession = async function createSession(
  products,
  shippingPrice,
  username,
  email,
) {
  const lineItemsData = [];
  try {
    for (let i = 0; i < products.length; i += 1) {
      const data = {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: products[i].name,
            metadata: { size: products[i].size, creator: products[i].creator },
          },
          unit_amount: products[i].price * 100,
        },
        quantity: 1,
      };
      lineItemsData.push(data);
    }
    const checkoutJSON = {
      line_items: lineItemsData,
      mode: 'payment',
      allow_promotion_codes: false,
      submit_type: 'pay',
      billing_address_collection: 'required',
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'DPD Normal',
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingPrice * 100,
              currency: 'gbp',
            },
          },
        },
      ],
      success_url: `${process.env.HOST}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOST}/payment-failure`,
    };
    // if logged in user
    console.log(username);

    if (username) {
      try {
        const user = await User.findOne({ username });
        // if already has purchase
        if (user.customerID) checkoutJSON.customer = user.customerID;
        // if first purchase
        else checkoutJSON.customer_email = user.email;
      } catch (err) {
        return false;
      }
    } else checkoutJSON.customer_email = email;
    console.log(checkoutJSON);
    const session = await stripe.checkout.sessions.create(
      checkoutJSON,
      // customer: customerID,
      // reciept_email: email
    );

    return session.url;
  } catch (err) {
    console.log(err);
    return '';
  }
};

module.exports.getSession = async function getSession(sessionID) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionID);
    const customer = await stripe.customers.retrieve(session.customer);
    return {
      success: true,
      name: customer.name,
      email: customer.email,
      orderID: session.id,
      customerID: customer.id,
    };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

module.exports.checkSession = async function checkSession(sessionID) {
  try {
    await stripe.checkout.sessions.retrieve(sessionID);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// module.exports.convertToLineItem = async function convertToLineItem() {};

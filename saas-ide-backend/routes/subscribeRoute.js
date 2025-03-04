const express = require("express");
const router = express.Router();
const {
  lemonSqueezySetup,
  createCheckout,
} = require("@lemonsqueezy/lemonsqueezy.js");

// Set up Lemon Squeezy with your API key
lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError: (error) => {
    console.error("Lemon Squeezy error:", error);
  },
});

// Subscription route
router.post("/", async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const variantId = "YOUR_SUBSCRIPTION_VARIANT_ID";

    const checkout = await createCheckout({
      storeId: process.env.LEMON_SQUEEZY_STORE_ID,
      variantId,
      attributes: {
        checkout_data: {
          email,
          name,
          custom: { userId }, // Link checkout to this user
        },
        checkout_options: {
          redirect_url: "https://yourdomain.com/api/subscribe/success",
        },
      },
    });

    res.json({ checkoutUrl: checkout.data.attributes.url });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Error creating checkout" });
  }
});



router.get('/success', async (req, res) => {
    const { order_id } = req.query;

    if (!order_id) {
        return res.status(400).send('Missing order_id');
    }

    const order = await getOrder(order_id); // Verify payment with Lemon Squeezy API
    if (order.data.attributes.status === 'paid') {
        const userId = order.data.attributes.custom_data.userId;
        await User.findByIdAndUpdate(userId, { isPro: true }); // Set user as pro
        res.send('You are now a pro user!');
    } else {
        res.status(400).send('Payment not completed.');
    }
});

module.exports = router;
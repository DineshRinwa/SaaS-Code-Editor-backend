const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
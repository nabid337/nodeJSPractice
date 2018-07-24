var mongoose = require('mongoose');


var QuoteSchema = new mongoose.Schema({
  quoteMsg: {
    type: String,
    required: true,
    trim: true
  },
  quoteBy: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
   // required: true,
    trim: true
  }
});




var Quote = mongoose.model('Quote', QuoteSchema);
module.exports = Quote;
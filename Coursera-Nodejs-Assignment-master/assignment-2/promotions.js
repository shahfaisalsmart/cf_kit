const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

var promoSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        requireed: true
    },
    label:{
        type: String,
        default: ""
    },
    features:{
        type: String,
        default: ""
    },
    price:{
        type: Currency,
        required: true
    },
    description:{
        type: String,
        requireed: true
    }
}, {
    timestamps: true
});

var promotions = mongoose.model("promotion", promoSchema);//promotion will get converted to promotions
module.exports = promotions;
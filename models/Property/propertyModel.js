//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let propertyDataSchema = new Schema({
    property_name: {
        type: String,
        require: true,
    },
    full_address: {
        type: String
    },
    city_name: {
        type: String
    },
    state_name: {
        type: String,
    },
    zip_code: {
        type: Number
    },
    number_of_units: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    posted_date: {
        type: Date,
        required: true,
    },
    posted_by: {
        type: Schema.Types.ObjectId,
    },
    posted_user: {
        type: String,
    },
    modified_date: {
        type: Date
    },
    modified_by: {
        type: Schema.Types.ObjectId,
    }
});


//Export function to create this model class
let propertyData = mongoose.model('propertyData', propertyDataSchema, 'propertyData');
module.exports = propertyData;
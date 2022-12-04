//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let unitDataSchema = new Schema({
    property: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'propertyData'
        },
        property_name: {
            type: String, 
            required: true
        }
    },
    unit_name: {
        type: String,
        required: true,
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
let unitData = mongoose.model('unitData', unitDataSchema, 'unitData');
module.exports = unitData;
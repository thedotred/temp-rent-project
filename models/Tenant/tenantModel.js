//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let tenantDataSchema = new Schema({
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
    unit: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'unitData'
        },
        unit_name: {
            type: String, 
            required: true
        }
    },
    tenant_name: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
    },
    lease_start: {
        type: Date,
        required: true,
    },
    lease_end: {
        type: Date,
        required: true,
    },
    lease_amount: {
        type: Number,
        required: true,
    },
    due_day: {
        type: Number,
        min: [1, 'minimum should be 1'],
        max: [31, 'miximum should be 31'],
        required: true,
    },
    deposite_amount: {
        type: Number,
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
let tenantData = mongoose.model('tenantData', tenantDataSchema, 'tenantData');
module.exports = tenantData;
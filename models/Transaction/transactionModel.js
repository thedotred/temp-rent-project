//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let transactionDataSchema = new Schema({
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
    tenant: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'tenantData'
        },
        tenant_name: {
            type: String, 
            required: true
        }
    },
    ledger: {
        _id: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'ledgerData'
        },
        ledger_name: {
            type: String, 
            required: true
        }
    },
    transaction_date: {
        type: Date,
        required: true,
    },
    transaction_amount: {
        type: Number,
        required: true
    },
    transaction_number: {
        type: String,
        required: true,
    },
    double_entry_amount: {
        type: Number,
    },
    reference_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reference_module: {
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
let transactionData = mongoose.model('transactionData', transactionDataSchema, 'transactionData');
module.exports = transactionData;
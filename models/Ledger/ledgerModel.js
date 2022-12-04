//Require Mongoose 
let mongoose = require('mongoose');

//Define schema
let Schema = mongoose.Schema;

//Define model
let ledgerDataSchema = new Schema({
    ledger_code: {
        type: String,
        required: true,
    },
    ledger_name: {
        type: String,
        required: true,
    },
    ledger_category: {
        type: String,
        required: true,
        enum: ['Income', 'Expense', 'Asset']
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
let ledgerData = mongoose.model('ledgerData', ledgerDataSchema, 'ledgerData');
module.exports = ledgerData;
const transactionData = require('../../models/Transaction/transactionModel');

async function transactionCreate (model, referenceId, referenceModule, transactionId) {
    let transactionModel = model;
    transactionModel._id = transactionId;
    transactionModel.reference_id = referenceId;
    transactionModel.reference_module = referenceModule;

    if(referenceModule == 'invoiceData') {
        transactionModel.double_entry_amount = transactionModel.transaction_amount;
    // } else if (referenceModule == 'expenseData') {
    //     transactionModel.double_entry_amount = transactionModel.transaction_amount * (- 1);
    } else {
        transactionModel.double_entry_amount = transactionModel.transaction_amount * (- 1);
    }

    await transactionData.create(transactionModel, (err, result) => {
        if(err) {
            console.log("Failed to create a new tarnsaction");
            throw err;
        }
        return {
            success: true,
            message: "Successfully created a new tarnsaction.",
            _id: result._id
        }
    })
}

async function transactionDelete (deleteId) {
    let delPromise = new Promise(function (resolved, reject) {
        transactionData.deleteOne({ '_id': deleteId }, (err, result) => {
            if(err) {
                reject(console.log("Failed to delete a expense"));
            }
            console.log('Successfully deleted a tarnsaction.')
            resolved({
                success: true,
                message: "Successfully deleted a tarnsaction.",
                data: result
            });
        });
    })

    return delPromise;
}

async function transactionUpdate (model, referenceModule) {
    let updateModel = model;
    updateModel.reference_id = model._id;
    updateModel.reference_module = referenceModule;

    delete model._id;

    if(referenceModule == 'invoiceData') {
        updateModel.double_entry_amount = updateModel.transaction_amount;
    } else if (referenceModule == 'expenseData') {
        updateModel.double_entry_amount = updateModel.transaction_amount * (- 1);
    } else {
        updateModel.double_entry_amount = updateModel.transaction_amount;
    }

    let updatePromise = new Promise(function (resolved, reject) {
        transactionData.updateOne({ '_id': updateModel.item_reference },{$set: updateModel},(err, result) => {
            if(err) {
                reject(console.log("Failed to updated a transaction"));
            }
            console.log('Successfully updated a transaction.')
            resolved({
                success: true,
                message: "Successfully updated a transaction.",
                data: result
            });
        });
    });

    return updatePromise;
}

module.exports = {
    transactionCreate,
    transactionDelete,
    transactionUpdate
};
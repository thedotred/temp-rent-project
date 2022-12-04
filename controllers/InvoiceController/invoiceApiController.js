const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');
const invoiceData = require('../../models/Invoice/invoiceModel');
const { transactionCreate, transactionDelete, transactionUpdate } = require('../TransactionController/transactionFunctions');
const { ObjectId } = require('mongodb');
const { generator } = require('../../utils/sequence');

router.post('/query/get', async (req, res) => {
  let query = JSON.parse(req.body.models);

  let limit =
    isEmpty(req.body.limit) ||
    !isNumeric(req.body.limit) ||
    parseInt(req.body.limit) > 20
      ? 20
      : parseInt(req.body.limit);
  let skip =
    isEmpty(req.body.skip) ||
    !isNumeric(req.body.skip) ||
    parseInt(req.body.skip)
      ? 0
      : parseInt(req.body.skip);

  let queryCount = await invoiceData.countDocuments(query);
  let invoice = await invoiceData
    .find(query)
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    total: queryCount,
    data: invoice,
  });
});

router.post('/update', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  await invoiceData.updateOne(
    {'_id': model._id}, 
    {$set: model}
  )
  .then(async (res) => {
    console.log("Successfully updated a invoice");
    const upTransaction = await transactionUpdate(model, 'invoiceData');
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a invoice");
      throw err;
    }
  })

  res.status(200).send({data: [model]});
});

router.post('/delete', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  await invoiceData.deleteOne(
    {'_id': model._id}
  )
  .then(async (res) => {
    console.log("Successfully deleted a invoice");
    const delTransaction = await transactionDelete(model.item_reference);
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a invoice");
      throw err;
    }
  })

  res.status(200).send({data: [model]});
});

router.post('/create',async (req, res) => {
  let model = JSON.parse(req.body.models)[0];
  let transactionId = ObjectId();
  let sequence = await generator("invoice_number", 1, 5, "INV-");

  model.transaction_number = sequence;
  model.posted_date = moment().toDate();
  model.item_reference = transactionId;
  delete model._id;

  invoiceData.create(model, async (err, result)=>{
    if (err)
    {
      console.log("Failed to create a new invoice");
      throw err;
    }
    const transaction = await transactionCreate(model, result._id, 'invoiceData', transactionId);
    model._id = result._id;
    console.log("Successfully created a new invoice.");
    res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  invoiceData.find({},(err,result)=>{
    if (err) throw err;
    return res.status(200).send(result);
  });
});



module.exports = router;
const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');
const collectionData = require('../../models/Collection/collectionModel');
const ledgerData = require('../../models/Ledger/ledgerModel');
const { transactionCreate, transactionDelete, transactionUpdate } = require('../TransactionController/transactionFunctions');
const { ObjectId } = require('mongodb');

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

  let queryCount = await collectionData.countDocuments(query);
  let collection = await collectionData
    .find(query)
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    total: queryCount,
    data: collection,
  });
});

router.post('/update', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  await collectionData.updateOne(
    {'_id': model._id}, 
    {$set: model}
  )
  .then(async (res) => {
    console.log("Successfully updated a collection");
    const upTransaction = await transactionUpdate(model, 'collectionData');
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a collection");
      throw err;
    }
  })

  res.status(200).send({data: [model]});
});

router.post('/delete', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  await collectionData.deleteOne(
    {'_id': model._id}
  )
  .then(async (res) => {
    console.log("Successfully deleted a collection");
    const delTransaction = await transactionDelete(model.item_reference);
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a collection");
      throw err;
    }
  })

  res.status(200).send({data: [model]});
});

router.post('/create',(req, res) => {
  let model = JSON.parse(req.body.models)[0];
  model.invoice.invoice_number = model.invoice.transaction_number;
  
  let transactionId = ObjectId();

  model.posted_date = moment().toDate();
  model.item_reference = transactionId;
  delete model._id;

  collectionData.create(model, async (err, result)=>{
    if (err)
    {
      console.log("Failed to create a new collection");
      throw err;
    }
    const transaction = await transactionCreate(model, result._id, 'collectoinData', transactionId);
    model._id = result._id;
    console.log("Successfully created a new collection.");
    res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  collectionData.find({},(err,result)=>{
    if (err) throw err;
    return res.status(200).send(result);
  });
});

module.exports = router;
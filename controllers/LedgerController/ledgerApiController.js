const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');

const ledgerData = require('../../models/Ledger/ledgerModel');

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

    let queryCount = await ledgerData.countDocuments(query);
    let ledger = await ledgerData
      .find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: ledger,
    });
});

router.post('/query/get2', async (req, res) => {
  let query = JSON.parse(req.body.models);
  ledgerData.find(query,(err,result)=>{
    if (err) throw err;
    return res.status(200).send(result);
  });
})

router.post('/update', (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  ledgerData.updateOne({'_id': model._id}, {$set: model},(err)=>{
      if (err)
      {
          console.log("Failed to update a ledger");
          throw err;
      }
      console.log("Successfully updated a ledger");
      res.status(200).send({data: [model]});
  });
});

router.post('/delete', (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  ledgerData.deleteOne({'_id': model._id},async (err)=>{
      if (err)
      {
          console.log("Failed to delete a ledger");
          throw err;
      }
      console.log("Successfully deleted a ledger");
      res.status(200).send({data: [model]});
  });
});

router.post('/create', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  model.posted_date = moment().toDate();
  delete model._id;

  ledgerData.create(model,(err, result)=>{
      if (err)
      {
          console.log("Failed to create a new ledger");
          throw err;
      }
      model._id = result._id;
      console.log("Successfully created a new ledger.");
      res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  ledgerData.find({},(err,result)=>{
      if (err) throw err;
      return res.status(200).send(result);
  });
});

module.exports = router;
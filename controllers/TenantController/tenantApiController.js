const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');
const tenantData = require("../../models/Tenant/tenantModel");

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

    let queryCount = await tenantData.countDocuments(query);
    let tenant = await tenantData
      .find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: tenant,
    });
});

router.post('/update', (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  tenantData.updateOne({'_id': model._id}, {$set: model},(err)=>{
      if (err)
      {
        console.log("Failed to update a tenant");
        throw err;
      }
      console.log("Successfully updated a tenant");
      res.status(200).send({data: [model]});
  });
});

router.post('/delete', (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  tenantData.deleteOne({'_id': model._id},async (err)=>{
      if (err)
      {
        console.log("Failed to delete a tenant");
        throw err;
      }
      console.log("Successfully deleted a tenant");
      res.status(200).send({data: [model]});
  });
});

router.post('/create', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  model.posted_date = moment().toDate();
  delete model._id;

  tenantData.create(model,(err, result)=>{
      if (err)
      {
        console.log("Failed to create a new tenant");
        throw err;
      }
      model._id = result._id;
      console.log("Successfully created a new tenant.");
      res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  tenantData.find({},(err,result)=>{
    if (err) throw err;
    return res.status(200).send(result);
  });
});

module.exports = router;
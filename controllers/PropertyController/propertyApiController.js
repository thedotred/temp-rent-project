const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');

const propertyData = require('../../models/Property/propertyModel');

router.post('/create', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  model.posted_date = moment().toDate();
  delete model._id;

  propertyData.create(model,(err, result)=>{
    if (err)
    {
      console.log("Failed to create a new property");
      throw err;
    }
    model._id = result._id;
    console.log("Successfully created a new property.");
    res.status(200).send({data: [model]});
  });
});

router.post('/update', (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  propertyData.updateOne({'_id': model._id}, {$set: model},(err)=>{
      if (err)
      {
          console.log("Failed to update a property");
          throw err;
      }
      console.log("Successfully updated a property");
      res.status(200).send({data: [model]});
  });
});

router.post('/delete', (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  propertyData.deleteOne({'_id': model._id},async (err)=>{
      if (err)
      {
          console.log("Failed to delete a property");
          throw err;
      }
      console.log("Successfully deleted a property");
      res.status(200).send({data: [model]});
  });
});

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

    let queryCount = await propertyData.countDocuments(query);
    let property = await propertyData
      .find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: property,
    });
});

router.get('/get', (req, res) => {
  propertyData.find({},(err,result)=>{
        if (err) throw err;
        return res.status(200).send(result);
    });
});

module.exports = router;
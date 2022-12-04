const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');

const jobData = require('../../models/Job/jobModel');

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

    let queryCount = await jobData.countDocuments(query);
    let job = await jobData
      .find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: job,
    });
});

router.post('/update', (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  jobData.updateOne({'_id': model._id}, {$set: model},(err)=>{
      if (err)
      {
          console.log("Failed to update a job");
          throw err;
      }
      console.log("Successfully updated a job");
      res.status(200).send({data: [model]});
  });
});

router.post('/delete', (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  jobData.deleteOne({'_id': model._id},async (err)=>{
      if (err)
      {
          console.log("Failed to delete a job");
          throw err;
      }
      console.log("Successfully deleted a job");
      res.status(200).send({data: [model]});
  });
});

router.post('/create', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  model.posted_date = moment().toDate();
  delete model._id;

  jobData.create(model,(err, result)=>{
      if (err)
      {
          console.log("Failed to create a new job");
          throw err;
      }
      model._id = result._id;
      console.log("Successfully created a new job.");
      res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  jobData.find({},(err,result)=>{
        if (err) throw err;
        return res.status(200).send(result);
    });
});

module.exports = router;
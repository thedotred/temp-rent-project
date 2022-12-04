const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../../utils/validation');

const unitData = require('../../models/Unit/unitModel');
const propertyData = require('../../models/Property/propertyModel');

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

    let queryCount = await unitData.countDocuments(query);
    let unit = await unitData
      .find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: unit,
    });
});


router.post('/update', (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  unitData.updateOne({'_id': model._id}, {$set: model},(err)=>{
      if (err)
      {
          console.log("Failed to update a unit");
          throw err;
      }
      console.log("Successfully updated a unit");
      res.status(200).send({data: [model]});
  });
});

router.post('/delete', (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  unitData.deleteOne({'_id': model._id},async (err)=>{
      if (err)
      {
          console.log("Failed to delete a unit");
          throw err;
      }
      console.log("Successfully deleted a unit");
      res.status(200).send({data: [model]});
  });
});

router.post('/create', async (req, res) => {
  let models = JSON.parse(req.body.models);

  for(let model = 0; model < models.length; model++){
    models[model].posted_date = moment().toDate();
    delete models[model]._id;
  }

  unitData.insertMany(models, async (err, results)=>{
    if (err)
    {
      console.log("Failed to create a new unit");
      throw err;
    }

    let updatePropertyCount = new Promise(function (resolved, reject) {
      propertyData.updateOne({ '_id': models[0].property._id },{$inc: {number_of_units: models.length}},(err, result) => {
            if(err) {
                reject(console.log("Failed to updated unit count"));
            }
            console.log('Successfully updated unit count.')
            resolved({
                success: true,
                message: "Successfully updated unit count.",
                data: result
            });
        });
    });

    console.log('pro count >>', updatePropertyCount);

    // await propertyData.updateOne({$inc: {number_of_units: models.length}}, (err, results) => {
    //   if(err) throw err;
    //   console.log("update result >>", results)
    // })
    res.status(200).send({data: results});
  });


});

router.get('/get', (req, res) => {
  unitData.find({},(err,result)=>{
        if (err) throw err;
        return res.status(200).send(result);
    });
});

module.exports = router;
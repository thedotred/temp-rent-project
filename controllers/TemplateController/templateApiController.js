
const express = require('express'),
router = express.Router();

const templateModel = require('../../models/Template/templateModel');

//Create new role
    router.post('/create',(req,res)=>{
        console.log('received');
        var model = JSON.parse(req.body.models);
        
        templateModel.create(model[0],(err, result)=>{
            if (err)
            {
                console.log("Failed to create new role - " + new Date());
                throw err;
            }
            model[0]._id = result._id;
            console.log("Successfully created new role - " + result._id + ' - ' + new Date());
            res.status(200).send(model);
        });
    });

//Edit a role
    router.post('/update',(req,res)=>{
        var model = JSON.parse(req.body.models);
        templateModel.updateOne({'_id': model[0]._id}, {$set: model[0]},(err, result)=>{
            if (err)
            {
                console.log("Failed to update policy - " + model[0]._id + new Date());
                throw err;
            }
            console.log("Successfully updated policy - " + model[0]._id + ' - ' + new Date());
            res.status(200).send(model);
        });
    });

//Delete a role
    router.post('/delete',(req,res)=>{
        var model = JSON.parse(req.body.models);

        templateModel.deleteOne({'_id': model[0]._id},(err)=>{
            if (err)
            {
                console.log("Failed to delete policy - " + model[0]._id + new Date());
                throw err;
            }
            console.log("Successfully deleted policy - " + model[0]._id + ' - ' + new Date());
            res.status(200).send(model);
        });
    });

//Get role list
    router.get('/get/query',(req,res)=>{
        let query = req.query;
        templateModel.find(query,(err,result)=>{
            if (err) throw err;
            return res.status(200).send(result);
        });
    });

    router.get('/get',(req,res)=>{
        templateModel.find({},(err,result)=>{
            if (err) throw err;
            return res.status(200).send(result);
        });
    });

module.exports = router
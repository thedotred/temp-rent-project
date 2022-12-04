const express = require('express'),
router = express.Router();
var moment = require('moment');
var mongoose = require('mongoose');
// var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');

const transactionData = require('../../models/Transaction/transactionModel');
const invoiceData = require('../../models/Invoice/invoiceModel');
const unitData = require('../../models/Unit/unitModel');
const tenantData = require('../../models/Tenant/tenantModel');

router.get('/due/get', (req, res) => {
  invoiceData.aggregate([
    {
      '$lookup': {
        'from': 'collectionData', 
        'localField': '_id', 
        'foreignField': 'invoice._id', 
        'as': 'summary'
      }
    }, {
      '$unwind': {
        'path': '$summary', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id', 
          'property': '$property', 
          'unit': '$unit', 
          'tenant': '$tenant', 
          'ledger': '$ledger', 
          'invoice_amount': '$transaction_amount', 
          'invoice_number': '$transaction_number', 
          'invoice_date': '$transaction_date'
        }, 
        'collection_amount': {
          '$sum': '$summary.transaction_amount'
        }
      }
    }, {
      '$project': {
        '_id': '$_id._id', 
        'property': '$_id.property', 
        'unit': '$_id.unit', 
        'tenant': '$_id.tenant', 
        'ledger': '$_id.ledger', 
        'invoice_amount': '$_id.invoice_amount', 
        'invoice_number': '$_id.invoice_number', 
        'invoice_date': '$_id.invoice_date', 
        'collection_amount': 1, 
        'due_amount': {
          '$subtract': [
            '$_id.invoice_amount', '$collection_amount'
          ]
        }
      }
    }, {
      '$match': {
        'due_amount': {
          '$gt': 0
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate due data");
      throw err;
    }
    return res.status(200).send(result);
  });
});

router.post('/profitability/query/get', (req, res) => {
  let model = JSON.parse(req.body.models);

  let start_date = moment(model.startDate).startOf('day').toDate(),
    end_date = moment(model.endDate).endOf('day').toDate();

  transactionData.aggregate([
    {
      '$match': {
        'transaction_date': {
          '$gte': start_date,
          '$lte': end_date
        },
        'property._id': model.property ? mongoose.Types.ObjectId(`${model.property}`) :  {
          '$exists': true
        },
        'unit._id': model.unit ? mongoose.Types.ObjectId(`${model.unit}`) :  {
          '$exists': true
        },
        'tenant._id': model.tenant ? mongoose.Types.ObjectId(`${model.tenant}`) :  {
          '$exists': true
        },
      },
    }, {
        '$group': {
        '_id': '$ledger._id', 
        'total': {
            '$sum': '$double_entry_amount'
        }
        }
    }, {
        '$sort': {
        'total': -1
        }
    }, {
        '$lookup': {
        'from': 'ledgerData', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'summary'
        }
    }, {
        '$unwind': {
        'path': '$summary', 
        'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
        '_id': '$_id', 
        'ledger_code': '$summary.ledger_code', 
        'ledger_name': '$summary.ledger_name', 
        'ledger_category': '$summary.ledger_category', 
        'total': '$total'
        }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate profitability data");
      throw err;
    }
    return res.status(200).send(result);
  });
});

router.get('/profitability/property/query/get', (req, res) => {
  transactionData.aggregate([
    {
      '$group': {
        '_id': '$property._id', 
        'income': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$reference_module', 'invoiceData'
                ]
              }, '$transaction_amount', 0
            ]
          }
        }, 
        'expense': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$reference_module', 'expenseData'
                ]
              }, '$double_entry_amount', 0
            ]
          }
        }
      }
    }, {
      '$lookup': {
        'from': 'propertyData', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'property'
      }
    }, {
      '$unwind': {
        'path': '$property', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        '_id': 1, 
        'property_name': {
          '$cond': [
            {
              '$eq': [
                {
                  '$type': '$property'
                }, 'missing'
              ]
            }, 'Unassigned', '$property.property_name'
          ]
        }, 
        'income': 1, 
        'expense': 1, 
        'profit': {
          '$add': [
            '$income', '$expense'
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate profitability data");
      throw err;
    }
    return res.status(200).send(result);
  });
});

router.get('/unit/get', (req, res) => {
  unitData.aggregate([
      {
        '$lookup': {
          'from': 'tenantData', 
          'localField': '_id', 
          'foreignField': 'unit._id', 
          'as': 'summary'
        }
      }, {
        '$unwind': {
          'path': '$summary', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'tenant_active': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$summary.isActive', true
                  ]
                }, 1, 0
              ]
            }
          }
        }
      }, {
        '$group': {
          '_id': null, 
          'total_occupied': {
            '$sum': '$tenant_active'
          }, 
          'total_unit': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'total_occupied': 1, 
          'total_unit': 1,
          'total_vacant': {
            '$subtract': ['$total_unit', '$total_occupied']
          }, 
          'occupancy_ratio': {
            '$divide': ['$total_occupied', '$total_unit']
          }
        }
      }
    ], (err, result) => {
      if(err) {
        console.log("Failed aggregare unit data");
        throw err;
      }
      // console.log("result >>", result);
      // return false;
      return res.status(200).send(result);
    })
});

router.get('/tenant/get', (req, res) => {
  tenantData.aggregate([
    {
      '$group': {
        '_id': '$_id', 
        'tenant_inactive': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$isActive', false
                ]
              }, 1, 0
            ]
          }
        }
      }
    }, {
      '$group': {
        '_id': null, 
        'inactive_tenants': {
          '$sum': '$tenant_inactive'
        }, 
        'total_tenants': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'inactive_tenants': 1, 
        'total_tenants': 1, 
        'active_tenants': {
          '$subtract': [
            '$total_tenants', '$inactive_tenants'
          ]
        }, 
        'occupancy_ratio': {
          '$divide': [
            '$inactive_tenants', '$total_tenants'
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate tenant data");
      throw err;
    }

    return res.status(200).send(result);
  })
});

router.get('/invoice/get', (req, res) => {
  invoiceData.aggregate([
    {
      '$lookup': {
        'from': 'collectionData', 
        'localField': '_id', 
        'foreignField': 'invoice._id', 
        'as': 'summary'
      }
    }, {
      '$unwind': {
        'path': '$summary', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id', 
          'property': '$property', 
          'unit': '$unit', 
          'ledger': '$ledger', 
          'tenant': '$tenant', 
          'invoice_date': '$transaction_date', 
          'invoice_amount': '$transaction_amount'
        }, 
        'collection_amount': {
          '$sum': '$summary.transaction_amount'
        }
      }
    }, {
      '$project': {
        '_id': 1, 
        'due_amount': {
          '$subtract': [
            '$_id.invoice_amount', '$collection_amount'
          ]
        }
      }
    }, {
      '$group': {
        '_id': null, 
        'total_invoice': {
          '$sum': 1
        }, 
        'total_invoice_amount': {
          '$sum': '$_id.invoice_amount'
        }, 
        'current_month_due_total_invoice': {
          '$sum': {
            '$cond': [
              {
                '$and': [
                  {
                    '$eq': [
                      {
                        '$month': '$_id.invoice_date'
                      }, {
                        '$month': new Date()
                      }
                    ]
                  }, {
                    '$gt': [
                      '$due_amount', 0
                    ]
                  }
                ]
              }, 1, 0
            ]
          }
        }, 
        'current_month_due_amount': {
          '$sum': {
            '$cond': [
              {
                '$and': [
                  {
                    '$eq': [
                      {
                        '$month': '$_id.invoice_date'
                      }, {
                        '$month': new Date()
                      }
                    ]
                  }, {
                    '$gt': [
                      '$due_amount', 0
                    ]
                  }
                ]
              }, '$due_amount', 0
            ]
          }
        }, 
        'previous_month_due_total_invoice': {
          '$sum': {
            '$cond': [
              {
                '$and': [
                  {
                    '$ne': [
                      {
                        '$month': '$_id.invoice_date'
                      }, {
                        '$month': new Date()
                      }
                    ]
                  }, {
                    '$gt': [
                      '$due_amount', 0
                    ]
                  }
                ]
              }, 1, 0
            ]
          }
        }, 
        'previous_month_due_amount': {
          '$sum': {
            '$cond': [
              {
                '$and': [
                  {
                    '$ne': [
                      {
                        '$month': '$_id.invoice_date'
                      }, {
                        '$month': new Date()
                      }
                    ]
                  }, {
                    '$gt': [
                      '$due_amount', 0
                    ]
                  }
                ]
              }, '$due_amount', 0
            ]
          }
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'total_invoice': 1, 
        'total_invoice_amount': 1, 
        'current_month_due_total_invoice': 1, 
        'current_month_due_amount': 1, 
        'previous_month_due_total_invoice': 1, 
        'previous_month_due_amount': 1, 
        'unpaid_amount': {
          '$sum': [
            '$current_month_due_amount', '$previous_month_due_amount'
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate invoice data");
      throw err;
    }

    return res.status(200).send(result);
  })
});

router.get('/profitability/dashboard/get', (req, res) => {
  transactionData.aggregate([
    {
      '$group': {
        '_id': null, 
        'invoice_total': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$reference_module', 'invoiceData'
                ]
              }, '$transaction_amount', 0
            ]
          }
        }, 
        'expense_total': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$reference_module', 'expenseData'
                ]
              }, '$transaction_amount', 0
            ]
          }
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'invoice_total': 1, 
        'expense_total': 1, 
        'profit': {
          '$subtract': [
            '$invoice_total', '$expense_total'
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate invoice dashboard data");
      throw err;
    }

    return res.status(200).send(result);
  });
});

router.get('/tenant/query/get', (req, res) => {
  tenantData.aggregate([
    {
      '$match': {
        '$expr': {
          '$eq': [
            {
              '$month': '$lease_end'
            }, {
              '$month': new Date()
            }
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) {
      console.log("Failed aggregate lease expire tenant data");
      throw err;
    }

    // return res.status(200).send(result);

    let queryCount = result.length;

    return res.status(200).json({
      success: true,
      total: queryCount,
      data: result,
    });
  })
});

router.get('/tenant/due/get', (req, res) => {
  invoiceData.aggregate([
    {
      '$lookup': {
        'from': 'collectionData', 
        'localField': '_id', 
        'foreignField': 'invoice._id', 
        'as': 'summary'
      }
    }, {
      '$unwind': {
        'path': '$summary', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id', 
          'property': '$property', 
          'unit': '$unit', 
          'tenant': '$tenant', 
          'invoice_amount': '$transaction_amount'
        }, 
        'collection_amount': {
          '$sum': '$summary.transaction_amount'
        }
      }
    }, {
      '$project': {
        '_id': '$_id._id', 
        'property': '$_id.property', 
        'unit': '$_id.unit', 
        'tenant': '$_id.tenant', 
        'invoice_amount': '$_id.invoice_amount', 
        'collection_amount': 1, 
        'due_amount': {
          '$subtract': [
            '$_id.invoice_amount', '$collection_amount'
          ]
        }
      }
    }
  ], (err, result) => {
    if(err) throw err;

    return res.status(200).send(result);
  })
})

module.exports = router;
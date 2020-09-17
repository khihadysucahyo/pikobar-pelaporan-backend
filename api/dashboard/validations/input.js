const Joi = require('joi')
const _ = require('lodash')
const { validateOptions } = require('../../validations')
// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------
const dashboardValidation = {
  query: {
    address_district_code: Joi.string().empty('', null).default('').description('search data by address_district_code'),
    status: Joi.string().empty('', null).default('').description('search data by status'),
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction,
}

module.exports = {
  dashboardValidation,
}

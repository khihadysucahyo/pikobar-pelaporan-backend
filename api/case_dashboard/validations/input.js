const Joi = require('joi')
const _ = require('lodash')
const { validateOptions } = require('../../validations')
// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------
const caseDashboard = {
  query: {
    address_district_code: Joi.string().empty('', null).default('').description('search data by address_district_code'),
    address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa'),
    address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction,
}

module.exports = {
  caseDashboard,
}

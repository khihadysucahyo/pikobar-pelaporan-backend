const replyHelper = require('../helpers')

const getCasebyId = (server) => ({
  method: (request, reply) => {
    const id = request.params.caseId
    server.methods.services.cases
      .getById(id, (err, result) => {
        if (err) {
          return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
        }
        if (!result) {
          return reply({
            status: 422,
            message: 'Invalid case id',
            data: null,
          }).code(422).takeover()
        }
        return reply(result)
      })
  },
  assign: 'cases',
})

const getCloseContactbyId = (server) => ({
  method: (request, reply) => {
    const id = request.params.closeContactId
    server.methods.services.closeContacts
      .show(id, (err, result) => {
        if (err) {
          return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
        }
        if (!result) {
          return reply({
            status: 422,
            message: 'Invalid close contact id',
            data: null,
          }).code(422).takeover()
        }
        return reply(result)
      })
  },
  assign: 'close_contact',
})

const districtInputScope = (server) => ({
  method: (req, reply) => {
    const reqDistrict = req.payload.address_district_code
    const authDistrict = req.auth.credentials.user.code_district_city
    if (reqDistrict === authDistrict) {
      return reply(authDistrict)
    }
    return reply({
      status: 422,
      message: 'Anda tidak dapat melakukan input Kontak Erat di luar wilayah anda.!',
      data: null,
    }).code(422).takeover()
  },
  assign: 'district_input_scope',
})

module.exports = {
  getCasebyId,
  getCloseContactbyId,
  districtInputScope,
}

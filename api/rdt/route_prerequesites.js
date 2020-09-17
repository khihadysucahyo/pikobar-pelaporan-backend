const replyHelper = require('../helpers')

const validationBeforeInput = (server) => ({
  method: (req, reply) => {
    const reqDistrict = req.payload.address_district_code
    const authDistrict = req.auth.credentials.user.code_district_city
    if (reqDistrict === authDistrict) {
      return reply(authDistrict)
    }
    return reply({
      status: 403,
      message: 'Anda tidak dapat melakukan input test di luar wilayah anda.!',
      data: null,
    }).code(403).takeover()
  },
  assign: 'validation_before_input',
})

const countRdtCode = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.getCountRdtCode(
      request.payload.address_district_code,
      (err, count) => {
        if (err) {
          return reply(replyHelper.constructErrorResponse(err)).takeover()
        }
        return reply(count)
      },
    )
  },
  assign: 'count_rdt',
})

const countCaseByDistrict = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.getCountByDistrict(
      request.payload.address_district_code,
      (err, count) => {
        if (err) {
          return reply(replyHelper.constructErrorResponse(err)).takeover()
        }
        return reply(count)
      },
    )
  },
  assign: 'count_case',
})

const getRdtbyId = (server) => ({
  method: (request, reply) => {
    const { id } = request.params
    server.methods.services.rdt.getById(id, (err, item) => {
      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      return reply(item)
    })
  },
  assign: 'rdt',
})

const getCasebyIdcase = (server) => ({
  method: (request, reply) => {
    const idcase = request.pre.rdt.id_case
    server.methods.services.rdt.getCaseByidcase(
      idcase,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      },
    )
  },
  assign: 'cases',
})

const getCodeDinkes = (server) => ({
  method: (request, reply) => {
    const code = request.payload.address_district_code
    server.methods.services.rdt.getCodeDinkes(code, (err, item) => {
      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      return reply(item)
    })
  },
  assign: 'code_dinkes',
})

const checkIfDataNotNull = (server) => ({
  method: (request, reply) => {
    const { query } = request
    const { user } = request.auth.credentials
    const { fullname } = user

    server.methods.services.rdt.list(
      query,
      user,
      (err, result) => {
        if (result !== null) {
          if (result.rdt.length === 0) {
            return reply({
              status: 200,
              message: `Data untuk ${fullname} belum ada.`,
              data: null,
            }).code(200).takeover()
          }
          return reply()
        }
        return reply({
          status: 200,
          message: `Data untuk ${fullname} belum ada.`,
          data: null,
        }).code(200).takeover()
      },
    )
  },
  assign: 'check_rdt',
})

const getDataExternal = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.getDatafromExternal(
      request.query.address_district_code,
      request.query.search,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      },
    )
  },
  assign: 'data_pendaftaran',
})

const searchIdcasefromExternal = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.seacrhFromExternal(
      request.query.address_district_code,
      request.query.search,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      },
    )
  },
  assign: 'search_external',
})

const searchIdcasefromInternal = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.seacrhFromInternal(
      request.query,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      },
    )
  },
  assign: 'search_internal',
})

const getRegisteredUserfromExternal = (server) => ({
  method: (request, reply) => {
    server.methods.services.rdt.getRegisteredFromExternal(
      request.query,
      (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(item)
      },
    )
  },
  assign: 'reg_user_external',
})

const cekHistoryCases = (server) => ({
  method: (request, reply) => {
    const { source_data } = request.payload
    const { tool_tester } = request.payload
    const { final_result } = request.payload
    const payloads = {
      final_result: null,
      status: 'POSITIF',
      id_case: request.payload.id_case,
    }

    if (source_data === 'internal' && tool_tester === 'PCR' && final_result === 'POSITIF') {
      server.methods.services.histories.checkHistoryCasesBeforeInputTest(
        payloads,
        (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          return reply(item)
        },
      )
    } else {
      return reply()
    }
  },
  assign: 'cek_history_case',
})

const createHistoryWhenPositif = (server) => ({
  method: (request, reply) => {
    const { source_data } = request.payload
    const { tool_tester } = request.payload
    const { final_result } = request.payload
    const payloads = request.pre.cek_history_case

    if (source_data === 'internal' && tool_tester === 'PCR' && final_result === 'POSITIF') {
      server.methods.services.histories.createHistoryFromInputTest(
        payloads,
        (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          return reply(item)
        },
      )
    } else {
      return reply()
    }
  },
  assign: 'create_history_when_positif',
})

module.exports = {
  countRdtCode,
  getRdtbyId,
  getCasebyIdcase,
  getCodeDinkes,
  countCaseByDistrict,
  checkIfDataNotNull,
  getDataExternal,
  searchIdcasefromInternal,
  searchIdcasefromExternal,
  validationBeforeInput,
  getRegisteredUserfromExternal,
  cekHistoryCases,
  createHistoryWhenPositif,
}

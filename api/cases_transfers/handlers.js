const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructCasesResponse(cases) {
    const jsonCases = {
      status: 200,
      message: 'Success',
      data: cases,
    }
    return jsonCases
  }
  return {
    /**
         * GET /api/cases-transfer
         * @param {*} request
         * @param {*} reply
         */
    async ListCaseTransfer(request, reply) {
      const { query } = request
      const { type } = request.params

      server.methods.services.casesTransfers.list(
        query,
        request.auth.credentials.user,
        type,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(result, request),
          ).code(200)
        },
      )
    },
    /**
         * POST /api/cases-transfer
         * @param {*} request
         * @param {*} reply
         */
    CreateCaseAndTransfer(request, reply) {
      const { payload } = request
      const author = request.auth.credentials.user
      server.methods.services.cases.create(
        payload,
        author,
        request.pre,
        async (err, resultCase) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          server.methods.services.casesTransfers.processTransfer(
            request.params.transferId,
            resultCase._id,
            'pending',
            request.auth.credentials.user,
            request.payload,
            (err, result) => {
              if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
              return reply(
                constructCasesResponse({
                  ...result._doc,
                  case: resultCase,
                }, request),
              ).code(200)
            },
          )
        },
      )
    },
    /**
         * PUT /api/cases-transfer/{id}
         * @param {*} request
         * @param {*} reply
         */
    async UpdateCaseAndTransfer(request, reply) {
      const { pre } = request
      const { payload } = request
      const { id } = request.params
      const author = request.auth.credentials.user
      server.methods.services.cases.update(id, pre, author, payload,
        async (err, resultCase) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          server.methods.services.histories.createIfChanged(Object.assign(payload, { case: id }),
            (err, result) => {
              if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

              server.methods.services.casesTransfers.processTransfer(
                request.params.transferId,
                pre.transfer_case.transfer_case_id,
                'pending',
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                  if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                  return reply(
                    constructCasesResponse({
                      ...result._doc,
                      case: resultCase,
                    }, request),
                  ).code(200)
                },
              )
            })
        })
    },
    /**
         * GET /api/cases/{id}/transfers
         * @param {*} request
         * @param {*} reply
         */
    async GetCaseTransfers(request, reply) {
      server.methods.services.casesTransfers.get(
        request.params.id,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(result, request),
          ).code(200)
        },
      )
    },
    /**
         * PUT /api/cases/{id}/transfers
         * @param {*} request
         * @param {*} reply
         */
    async CreateCaseTransfer(request, reply) {
      const { payload } = request
      const { id } = request.params
      const author = request.auth.credentials.user

      server.methods.services.casesTransfers.create(
        id,
        author,
        request.pre,
        payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(result, request),
          ).code(200)
        },
      )
    },
    /**
         * POST /api/cases/{id}/transfers
         * @param {*} request
         * @param {*} reply
         */
    async ProcessCaseTransfer(request, reply) {
      server.methods.services.casesTransfers.processTransfer(
        request.params.transferId,
        request.pre.transfer_case.transfer_case_id,
        request.params.action,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          if (request.params.action === 'approve') {
            const { _id, ...historyPayload } = result.transfer_last_history.toObject()
            const historiesPayload = Object.assign(historyPayload, {
              current_location_type: 'RS',
              current_location_address: result.transfer_to_unit_name,
              hospital_id: result.transfer_to_unit_id,
            })

            server.methods.services.histories.createIfChanged(
              historiesPayload,
              (err, resultHistory) => resultHistory,
            )
          }

          return reply(
            constructCasesResponse(result, request),
          ).code(200)
        },
      )
    },
    /**
         * GET /api/cases/summary-transfers
         * @param {*} request
         * @param {*} reply
         */
    async GetCaseSummaryTransfer(request, reply) {
      server.methods.services.casesTransfers.geTransferCaseSummary(
        request.params.type,
        request.auth.credentials.user,
        (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(item, request),
          ).code(200)
        },
      )
    },
  }
}

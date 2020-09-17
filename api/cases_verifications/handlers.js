const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructCasesResponse(cases) {
    const jsonCases = {
      status: 200,
      message: 'Success',
      data: cases,
    }
    // return survey
    return jsonCases
  }

  return {
    /**
         * PUT /api/cases/{id}/verifications
         * @param {*} request
         * @param {*} reply
         */
    async ReviseCaseVerification(request, reply) {
      const { pre } = request
      const { id } = request.params
      const { payload } = request
      const author = request.auth.credentials.user
      const verifPayload = {
        verified_status: 'pending',
        verified_comment: payload.verified_comment,
      }

      server.methods.services.cases.update(id, pre, author, payload, (errCase, resultCase) => {
        if (errCase) return reply(replyHelper.constructErrorResponse(errCase)).code(422)

        server.methods.services.histories.createIfChanged(
          Object.assign(payload, { case: id }),
          (errHis, resultHis) => {
            if (errHis) return reply(replyHelper.constructErrorResponse(errHis)).code(422)

            server.methods.services.casesVerifications.create(
              id, author, request.pre.count_case, verifPayload,
              (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                  constructCasesResponse(result, request),
                ).code(200)
              },
            )
          },
        )
      })
    },
  }
}

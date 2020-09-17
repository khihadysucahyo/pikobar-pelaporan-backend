const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructCasesRevampResponse(casesRevamp) {
    const jsonCasesRevamp = {
      status: 200,
      message: 'Success',
      data: casesRevamp,
    }
    return jsonCasesRevamp
  }

  return {
    /**
         * POST /api/cases-revamp
         * @param {*} request
         * @param {*} reply
         */
    async CreateCaseRevamp(request, reply) {
      const { payload } = request
      server.methods.services.cases_revamp.create(
        payload,
        request.auth.credentials.user,
        request.pre,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesRevampResponse(result, request),
          ).code(200)
        },
      )
    },
    /**
         * GET /api/cases-revamp/{params}
         * @param {*} request
         * @param {*} reply
         */
    async CheckIfExisting(request, reply) {
      server.methods.services.cases_revamp.checkIfExisting(
        request.query, (err, listCase) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(constructCasesRevampResponse(listCase))
        },
      )
    },
    /**
         * {POST} /api/cases-revamp/{id}/contact
         * @param {*} request
         * @param {*} reply
        */
    async CreateCloseContact(request, reply) {
      server.methods.services.cases_revamp.createCaseContact(
        request.params.id,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesRevampResponse(result, request),
          ).code(200)
        },
      )
    },
    async UpdateloseContact(request, reply) {
      server.methods.services.cases_revamp.update(
        request.params.id,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesRevampResponse(result, request),
          ).code(200)
        },
      )
    },
  }
}

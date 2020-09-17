const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructRdtResponse(rdt) {
    const jsonRdt = {
      status: 200,
      message: 'Success',
      data: rdt,
    }
    // return survey
    return jsonRdt
  }

  return {
    /**
         * GET /api/rdt
         * @param {*} request
         * @param {*} reply
         */
    async ListRdt(request, reply) {
      const { query } = request

      server.methods.services.rdt.list(
        query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * POST /api/rdt
         * @param {*} request
         * @param {*} reply
         */
    async CreateRdt(request, reply) {
      const { payload } = request
      const { query } = request
      server.methods.services.rdt.create(
        query,
        payload,
        request.auth.credentials.user,
        request.pre,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result),
          ).code(200)
        },
      )
    },
    /**
         * POST /api/rdt
         * @param {*} request
         * @param {*} reply
         */
    async CreateRdtMultiple(request, reply) {
      const { payload } = request
      server.methods.services.rdt.createMultiple(
        payload,
        request.auth.credentials.user,
        request.pre,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtDetail(request, reply) {
      const { id } = request.params
      server.methods.services.rdt.getById(id, (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructRdtResponse(item),
        ).code(200)
      })
    },

    /**
         * GET /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtHistories(request, reply) {
      const { id } = request.params
      server.methods.services.rdt.getHistoriesByRdtId(id, (err, item) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructRdtResponse(item),
        ).code(200)
      })
    },

    /**
         * PUT /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
    async UpdateRdt(request, reply) {
      const { payload } = request
      const { id } = request.params

      server.methods.services.rdt.update(
        id,
        payload,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result),
          ).code(200)
        },
      )
    },

    /**
         * DELETE /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
    async DeleteRdt(request, reply) {
      server.methods.services.rdt.softDeleteRdt(
        request.pre.rdt,
        // request.pre.cases,
        request.auth.credentials.user,
        (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(item),
          ).code(202)
        },
      )
    },

    /**
         * DELETE /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
    async GetListIdCase(request, reply) {
      const { query } = request
      server.methods.services.rdt.FormSelectIdCase(
        query,
        request.auth.credentials.user,
        request.pre.data_pendaftaran,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * @param {*} request
         * @param {*} reply
         */
    async GetListIdCaseDetail(request, reply) {
      server.methods.services.rdt.FormSelectIdCaseDetail(
        request.pre.search_internal,
        request.pre.search_external,
        // request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * @param {*} request
         * @param {*} reply
         */
    async GetListRegisteredUser(request, reply) {
      server.methods.services.rdt.getRegisteredUser(
        request.pre.reg_user_external,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * @param {*} request
         * @param {*} reply
         */
    async formLocationTest(request, reply) {
      server.methods.services.rdt.getLocationTest(
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/summary-by-cities
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtSummaryByCities(request, reply) {
      const { query } = request

      server.methods.services.rdt.GetRdtSummaryByCities(
        query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/summary-result-by-cities
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtSummaryResultByCities(request, reply) {
      const { query } = request

      server.methods.services.rdt.GetRdtSummaryResultByCities(
        query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/summary-result-list-by-cities
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtSummaryResultListByCities(request, reply) {
      const { query } = request

      server.methods.services.rdt.GetRdtSummaryResultListByCities(
        query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/faskes-summary-by-cities
         * @param {*} request
         * @param {*} reply
         */
    async GetRdtFaskesSummaryByCities(request, reply) {
      const { query } = request

      server.methods.services.rdt.GetRdtFaskesSummaryByCities(
        query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructRdtResponse(result, request),
          ).code(200)
        },
      )
    },

    /**
         * GET /api/rdt/faskes-summary-by-cities
         * @param {*} request
         * @param {*} reply
         */
    async sendMessage(result) {
      // let query = request.query
      // server.methods.services.rdt.sendMessagesSMS(
      //     query,
      //     (err, result) => {
      //         if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      //         return reply(
      //             constructRdtResponse(result, request)
      //         ).code(200)
      //     })
      // server.methods.services.rdt.sendMessagesWA(
      //     query,
      //     (err, result) => {
      //         if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      //         return reply(
      //             constructRdtResponse(result, request)
      //         ).code(200)
      //     })
    },

  }// end
}

const json2xls = require('json2xls')
const moment = require('moment')
const fs = require('fs')
const replyHelper = require('../helpers')

module.exports = (server) => {
  const dashboardResponse = (dashboard) => {
    const jsonDashboard = {
      status: 200,
      message: 'Success',
      data: dashboard,
    }
    return jsonDashboard
  }

  return {
    /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
    async countGenderAge(request, reply) {
      server.methods.services.dashboard.countByGenderAge(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
    async countOdp(request, reply) {
      server.methods.services.dashboard.countByOdp(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
    async countPdp(request, reply) {
      server.methods.services.dashboard.countByPdp(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
    async countOtg(request, reply) {
      server.methods.services.dashboard.countByOtg(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
         * GET /api/dashboard/chart-confirm
         * @param {*} request
         * @param {*} reply
         */
    async countByConfirm(request, reply) {
      server.methods.services.dashboard.countByConfirm(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
         * GET /api/dashboard/chart-confirm
         * @param {*} request
         * @param {*} reply
         */
    async tabelAggregateCriteria(request, reply) {
      server.methods.services.dashboard.summaryAggregateByDinkes(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
    /**
          * GET /api/cases
          * @param {*} request
          * @param {*} reply
          */
    async tableLapHarianExport(request, reply) {
      const { query } = request
      const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
      server.methods.services.dashboard.lapHarianExport(
        query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          const jsonXls = json2xls(result)
          const fileName = `Data-Laporan-Harian-${fullName}-${moment().format('YYYY-MM-DD-HH-mm')}.xlsx`
          fs.writeFileSync(fileName, jsonXls, 'binary')
          const xlsx = fs.readFileSync(fileName)
          reply(xlsx)
            .header('Content-Disposition', `attachment; filename=${fileName}`)
          return fs.unlinkSync(fileName)
        },
      )
    },
    /**
         * GET /api/dashboard/aggregate-input-test
         * @param {*} request
         * @param {*} reply
         */
    async summaryInputTest(request, reply) {
      server.methods.services.dashboard.summaryInputTest(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200)
        },
      )
    },
  } // end
}

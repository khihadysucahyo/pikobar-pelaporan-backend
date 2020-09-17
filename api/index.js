const Sentry = require('@sentry/node')

const register = (server, options, next) => {
  const preResponse = (request, reply) => {
    const { response } = request
    // console.log('RESPONSE :', response);
    // console.log('RESPONSE_HEADER:', request.headers);
    // console.log('SERVER:', server.registrations);
    if (response.isBoom) {
      Sentry.captureException(response)

      const reformated = {}
      reformated.status = response.output.statusCode
      reformated.message = response.output.payload.message
      reformated.data = null
      return reply(reformated).code(response.output.statusCode)
    }
    return reply.continue()
  }

  const onRequest = (request, reply) => {
    // check status error jika sudah stack tidak ketemu masalahnya bisa dilihat disini !!
    // console.log('INFO:', request.info);
    // console.log('HEADERS:', request.headers);
    reply.continue()
  }

  const format = (seconds) => {
    const pad = (s) => (s < 10 ? '0' : '') + s
    const hours = Math.floor(seconds / (60 * 60))
    const minutes = Math.floor(seconds % (60 * 60) / 60)
    const secs = Math.floor(seconds % 60)

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }

  server.register(require('./users'))
  server.register(require('./areas'))
  server.register(require('./cases'))
  server.register(require('./cases_transfers'))
  server.register(require('./cases_verifications'))
  server.register(require('./histories'))
  server.register(require('./occupations'))
  server.register(require('./rdt'))
  server.register(require('./category'))
  server.register(require('./country'))
  server.register(require('./dashboard'))
  server.register(require('./logistics'))
  server.register(require('./map'))
  server.register(require('./unit'))
  server.register(require('./case_related'))
  server.register(require('./cases_revamp'))
  server.register(require('./close_contact'))
  server.register(require('./case_dashboard'))
  server.register(require('./reports'))
  server.register(require('./inject'))
  server.register(require('./history_travel'))
  server.register(require('./public_place'))
  server.register(require('./local_transmission'))
  server.register(require('./case_exposure'))
  server.register(require('./inspection_support'))

  server.ext('onPreResponse', preResponse)
  server.ext('onRequest', onRequest)

  server.route({
    method: 'GET',
    path: '/status',
    config: {
      description: 'Check status',
      notes: 'Check status of the API',
      tags: ['api', 'status'],
    },
    handler: (request, reply) => reply({ status: `UP in: ${format(require('os').uptime())}` }),
  })

  return next()
}

register.attributes = {
  pkg: require('./package.json'),
}

module.exports = register

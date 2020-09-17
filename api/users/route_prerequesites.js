const CheckRoleView = (server) => ({
  method: (request, reply) => {
    if (request.auth.credentials.user.role === 'superadmin'
                || request.auth.credentials.user.role === 'dinkesprov'
                || request.auth.credentials.user.role === 'faskes'
                || request.auth.credentials.user.role === 'dinkeskota') {
      return reply(request.auth.credentials.user.role)
    }
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null,
    }).code(403).takeover()
  },
  assign: 'roles',
})

const CheckRoleCreate = (server) => ({
  method: (request, reply) => {
    if (request.auth.credentials.user.role === 'superadmin'
                || request.auth.credentials.user.role === 'faskes'
                || request.auth.credentials.user.role === 'dinkeskota') {
      return reply(request.auth.credentials.user.role)
    }
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null,
    }).code(403).takeover()
  },
  assign: 'roles',
})

const CheckRoleUpdate = (server) => ({
  method: (request, reply) => {
    if (request.auth.credentials.user.role === 'superadmin'
                || request.auth.credentials.user.role === 'dinkeskota'
                || request.auth.credentials.user.role === 'faskes') {
      return reply(request.auth.credentials.user.role)
    }
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null,
    }).code(403).takeover()
  },
  assign: 'roles',
})

const CheckRoleDelete = (server) => ({
  method: (request, reply) => {
    if (request.auth.credentials.user.role === 'superadmin'
                || request.auth.credentials.user.role === 'dinkeskota'
                || request.auth.credentials.user.role === 'faskes') {
      return reply(request.auth.credentials.user.role)
    }
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null,
    }).code(403).takeover()
  },
  assign: 'roles',
})

module.exports = {
  CheckRoleView,
  CheckRoleCreate,
  CheckRoleUpdate,
  CheckRoleDelete,
}

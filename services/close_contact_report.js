const CloseContact = require('../models/CloseContact')
const CloseContactReport = require('../models/CloseContactReport')

async function eventCreate (closeContact) {
  try {
    await CloseContact.findByIdAndUpdate(closeContact, {
      is_reported: true
    })
  } catch (e) {
    console.log(e)
  }
}

async function show (closeContact, callback) {
  try {
    const params = { close_contact: closeContact }
    const result = await CloseContactReport
      .findOne(params)
      .populate('latest_report_history')

    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function create (closeContact, authorized, raw_payload, callback) {
  try {
    const { latest_report_history, ...payload } = raw_payload
    let result = new CloseContactReport(Object.assign(payload, {
      close_contact: closeContact,
      createdBy: authorized
    }))
    result = await result.save()

    eventCreate(closeContact)
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function update (closeContact, authorized, raw_payload, callback) {
  try {
    const { latest_report_history, ...payload } = raw_payload
    const params = { close_contact: closeContact }
    const result = await CloseContactReport.findOneAndUpdate(params,
      { $set: { ...payload, updatedBy: authorized} },
      { new: true })

    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.closeContactReport.show',
    method: show
  },
  {
    name: 'services.closeContactReport.create',
    method: create
  },
  {
    name: 'services.closeContactReport.update',
    method: update
  }
];

const { 
    CRITERIA 
} = require('../constant')

const {
    sum,
    sumBasedOnLocation
} = require('../filter/dailyreportfilter')

const generateGroupedDailyReport = (dates) => {
    return {
        "$facet": {
            'suspect': [{
                $group: {
                    _id: 'suspect',
                    ...sum([{ $eq: ['$status', CRITERIA.SUS] }], dates)
                }
            }],
            'probable': [{
                $group: {
                    _id: 'probable',
                    ...sum([{ $eq: ['$status', CRITERIA.PROB] }], dates)
                }
            }],
            'suspectIsolated': [{
                $group: {
                    _id: 'suspectIsolated',
                    ...sum([
                        { $eq: ['$status', CRITERIA.SUS] },
                        { $eq: ['$final_result', '4'] }
                    ], dates)
                }
            }],
            'suspectDiscarded': [{
                $group: {
                    _id: 'suspectDiscarded',
                    ...sum([
                        { $eq: ['$status', CRITERIA.SUS] },
                        { $eq: ['$final_result', '3'] }
                    ], dates)
                }
            }],
            'confirmed': [{
                $group: {
                    _id: 'confirmed',
                    ...sum([{ $eq: ['$status', CRITERIA.CONF] }], dates)
                }
            }],
            'confirmedSymptomatic': [{
                $group: {
                    _id: 'confirmedSymptomatic',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $isArray: ['$last_history.diagnosis'] },
                        { $ne: ['$last_history.diagnosis', [] ] }
                    ], dates)
                }
            }],
            'confirmedAsymptomatic': [{
                $group: {
                    _id: 'confirmedAsymptomatic',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $in: ['$last_history.diagnosis', [null, []] ] }
                    ], dates)
                }
            }],
            'closeContact': [{
                $group: {
                    _id: 'suspect',
                    ...sum([{ $eq: ['$status', CRITERIA.CLOSE] }], dates)
                }
            }],
            'deceaseConfirmed': [
            {
                $group: {
                    _id: 'decease',
                    ...sum([
                        { $eq: ['$status', CRITERIA.CONF] },
                        { $eq: ['$final_result', '2'] },
                    ], dates)
                }
            }
            ],
            'deceaseProbable': [{
                $group: {
                    _id: 'decease',
                    ...sum([
                        { $eq: ['$status', CRITERIA.PROB] },
                        { $eq: ['$final_result', '2'] },
                    ], dates)
                }
            }],
            'suspectProbableIsolation': [{
                $group: {
                    _id: 'emergencyHospitalIsolation',
                    ...sumBasedOnLocation([
                        { $in: [ '$status', [CRITERIA.SUS, CRITERIA.PROB] ] },
                    ], dates)
                }
            }],
            'confirmedIsolation': [{
                $group: {
                    _id: 'emergencyHospitalIsolation',
                    ...sumBasedOnLocation([
                        { $eq: [ '$status', CRITERIA.CONF ] },
                    ], dates)
                }
            }],
            'closeContactIsolation': [{
                $group: {
                    _id: 'closeContactIsolation',
                    ...sumBasedOnLocation([
                        { $eq: [ '$status', CRITERIA.CLOSE ] },
                        { $ne: [ '$final_result', null ] },
                    ], dates)
                }
            }],
        }
    }
}

module.exports = {
    generateGroupedDailyReport
}
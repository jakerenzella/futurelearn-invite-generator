const parse = require('csv-parse')
const _ = require('lodash')
const answers = require('../config.json')
const generators = require('./file_generators')

var newDFParser = parse({}, function (err, input_csv) {
    const headers = input_csv[0]

    var csv_properties = {
        email_idx: _.indexOf(headers, 'Email'),
        enrollment_status_idx: _.indexOf(headers, 'Student Attempt Status'),
        student_id_idx: _.indexOf(headers, 'Person ID'),
        first_name_idx: _.indexOf(headers, 'Given Names'),
        last_name_idx: _.indexOf(headers, 'Surname')
    }

    var enrolled_students = _.filter(input_csv, function (o) {
        return o[csv_properties.enrollment_status_idx] == 'ENROLLED'
    })

    var data = _.filter(input_csv, function (o) {
        return o[csv_properties.enrollment_status_idx] == 'ENROLLED' && !_.includes(existing_students, o[csv_properties.email_idx])
    })
    if (answers.whichInvitations.includes('discourse')) {
        generators.generate_discourse_csv(data, csv_properties)
    }
    generators.generate_doubtfire_csv("enrol", data, csv_properties)

    data = _.filter(input_csv, function (o) {
        return o[csv_properties.enrollment_status_idx] == 'DISCONTIN' && _.includes(existing_students, o[csv_properties.email_idx]) && !_.includes(enrolled_students, o[csv_properties.email_idx])
    })

    generators.generate_doubtfire_csv("withdraw", data, csv_properties)
})


var existingDFParser = parse({}, function (err, input_csv) {
    const headers = input_csv[0]
    var csv_properties = {
        username_idx: _.indexOf(headers, 'username'),
    }

    var data = _.map(input_csv.slice(1), function (o) {
        return o[csv_properties.username_idx]
    })

    existing_students = data
})

module.exports = {
    newDFParser: newDFParser,
    existingDFParser: existingDFParser
}
const stringify = require('csv-stringify')
const fs = require('fs')
const _ = require('lodash')
var util = require('util')

var generateConfig = function (configData) {
    fs.writeFile('config.json', configData, function (err) {
        if (err) {
            return console.error(err)
        }
    })
}

var generate_doubtfire_csv = function (kind, data, csv_properties) {
    var new_data = _.map(data, function (o) {
        return [global_answers.unitCode, o[csv_properties.email_idx], o[csv_properties.student_id_idx], o[csv_properties.first_name_idx], o[csv_properties.last_name_idx], o[csv_properties.email_idx] + '@deakin.edu.au', '']
    })

    new_data.unshift(['unit_code', 'username', 'student_id', 'first_name', 'last_name', 'email', 'tutorial'])

    stringify(new_data, function (err, output) {
        fs.writeFileSync(util.format("doubtfire_%s.csv", kind), output)
    })
}

var generate_discourse_csv = function (data, csv_properties) {
    var new_data = _.map(data, function (o) {
        return [o[csv_properties.email_idx] + '@deakin.edu.au', global_answers.discourseGroup, global_answers.topicID]
    })

    stringify(new_data, function (err, output) {
        fs.writeFileSync('discourse_invites.csv', output)
    })
}

module.exports = {
    generate_doubtfire_csv: generate_doubtfire_csv,
    generate_discourse_csv: generate_discourse_csv,
    generateConfig: generateConfig
}
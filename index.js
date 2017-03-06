const parse = require('csv-parse')
const stringify = require('csv-stringify')
const fs = require('fs')
const _ = require('lodash')
const inquirer = require('inquirer')
const path = process.argv.slice(2)[0]

const questions = [
    {
        type: 'input',
        name: 'unitCode',
        message: 'What is the unit code?'
    },
    {
        type: 'input',
        name: 'discourseGroup',
        message: 'Which Discourse group would you like to invite these students to?',
        default: 'Students'
    },
    {
        type: 'input',
        name: 'topicID',
        message: 'Which topic ID do you want to greet them with?',
        validate: function (value) {
            var valid = !isNaN(parseInt(value))
            return valid || 'Please enter a number'
        },
        filter: Number
    }
]

var glob_answers

var generate_doubtfire_csv = function (data, csv_properties) {
    var new_data = _.map(data, function (o) {
        return [glob_answers.unitCode, o[csv_properties.email_idx], o[csv_properties.student_id_idx], o[csv_properties.first_name_idx], o[csv_properties.last_name_idx], o[csv_properties.email_idx] + '@deakin.edu.au', '']
    })

    new_data.unshift(['unit_code', 'username', 'student_id', 'first_name', 'last_name', 'email', 'tutorial'])

    stringify(new_data, function (err, output) {
        fs.writeFileSync('doubtfire_invites.csv', output)
    })
}

var generate_discourse_csv = function (data, csv_properties) {
    var new_data = _.map(data, function (o) {
        return [o[csv_properties.email_idx] + '@deakin.edu.au', glob_answers.discourseGroup, glob_answers.topicID]
    })

    stringify(new_data, function (err, output) {
        fs.writeFileSync('discourse_invites.csv', output)
    })
}

var parser = parse({}, function (err, input_csv) {
    const headers = input_csv[0]

    var csv_properties = {
        email_idx: _.indexOf(headers, 'Email'),
        enrollment_status_idx: _.indexOf(headers, 'Student Attempt Status'),
        student_id_idx: _.indexOf(headers, 'Person ID'),
        first_name_idx: _.indexOf(headers, 'Given Names'),
        last_name_idx: _.indexOf(headers, 'Surname')
    }

    var data = _.filter(input_csv, function (o) {
        return o[csv_properties.enrollment_status_idx] == 'ENROLLED'
    })

    generate_discourse_csv(data, csv_properties)
    generate_doubtfire_csv(data, csv_properties)
})

var testFile = function (csvFile) {
    fs.stat(csvFile, function (err, stat) {
        if (err == null) {
            return true
        } else if (err.code == 'ENOENT') {
            console.log(err)
            process.exit(1)
        } else {
            console.log('Some other error: ', err.code)
            process.exit(1)
        }
    })
}

var start = function () {
    testFile(path)

    inquirer.prompt(questions).then(function (answers) {
        glob_answers = answers
        fs.createReadStream(path).pipe(parser)
    })
}

start()

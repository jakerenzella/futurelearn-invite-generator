#! /usr/bin/env node

const parse = require('csv-parse')
const stringify = require('csv-stringify')
const fs = require('fs')
const _ = require('lodash')
const inquirer = require('inquirer')
const path = process.argv.slice(2)[0]
const pathExistingDF = process.argv[3]

const questions = require('./inquirer_questions');
var util = require("util");

var global_answers
var existing_students

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

var parser = parse({}, function (err, input_csv) {
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

  if (global_answers.GenerateDiscourseInvites) {
    generate_discourse_csv(data, csv_properties)
  }
  generate_doubtfire_csv("enrol", data, csv_properties)

  data = _.filter(input_csv, function (o) {
    return o[csv_properties.enrollment_status_idx] == 'DISCONTIN' && _.includes(existing_students, o[csv_properties.email_idx]) && !_.includes(enrolled_students, o[csv_properties.email_idx])
  })

  generate_doubtfire_csv("withdraw", data, csv_properties)
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

  if (pathExistingDF) {
    testFile(pathExistingDF)
    fs.createReadStream(pathExistingDF).pipe(existingDFParser)
  }

  inquirer.prompt(questions).then(function (answers) {
    global_answers = answers
    fs.createReadStream(path).pipe(parser)
  })
}

start()

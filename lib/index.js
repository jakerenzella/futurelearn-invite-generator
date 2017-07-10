#! /usr/bin/env node

var program = require('commander')
const fs = require('fs')
const inquirer = require('inquirer')

const path = process.argv.slice(2)[0]
const pathExistingDF = process.argv[3]
const questions = require('./inquirer_questions')
const parsers = require('./parsers')
const fileGenerators = require('./file_generators')

var global_answers
var existing_students

var pipeParser = function (path, parser, callback) {
    var rs

    rs = fs.createReadStream(pathExistingDF)
    rs.on('error', function (error) {
        return callback(error)
    })
    rs.pipe(parser)
    return callback(null)
}

pipeParser(pathExistingDF, parsers.existingDFParser, function (error) {
    if (error) {
        console.error(error.message)
    }
    else {
        inquirer.prompt(questions).then(function (answers) {
            fileGenerators.generateConfig(answers)
            pipeParser(path, parsers.newDFParser, function (error) {
                if (error) {
                    console.error(error.message)
                }
            })
        })
    }
})

const questions = [
  {
    type: 'input',
    name: 'unitCode',
    message: 'What is the unit code?'
  },
  {
    type: 'confirm',
    name: 'GenerateDiscourseInvites',
    message: 'Would you like to generate invites for Discourse?'
  },
  {
    type: 'input',
    when: function (answers) {
      return answers.GenerateDiscourseInvites
    },
    name: 'discourseGroup',
    message: 'Which Discourse group would you like to invite these students to?',
    default: 'Students'
  },
  {
    type: 'input',
    when: function (answers) {
      return answers.GenerateDiscourseInvites
    },
    name: 'topicID',
    message: 'Which topic ID do you want to greet them with?',
    validate: function (value) {
      var valid = !isNaN(parseInt(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

module.exports = questions;
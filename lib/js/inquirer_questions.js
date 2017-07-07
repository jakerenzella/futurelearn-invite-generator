const questions = [
  {
    type: 'input',
    name: 'unitCode',
    message: 'What is the unit code?'
  },
  {
    type: 'checkbox',
    name: 'whichInvitations',
    message: 'Which platforms would you like to generate invitations for?',
    choices: ['doubtfire', 'discourse']
  },
  {
    type: 'input',
    when: function (answers) {
      console.log(answers)
      return answers.whichInvitations.includes('discourse')
    },
    name: 'discourseGroup',
    message: 'Which Discourse group would you like to invite these students to?',
    default: 'Students'
  },
  {
    type: 'input',
    when: function (answers) {
      return answers.whichInvitations.includes('discourse')
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
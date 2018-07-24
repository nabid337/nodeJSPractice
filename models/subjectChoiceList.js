var mongoose = require('mongoose');


var SubjectChoiceSchema = new mongoose.Schema({
    subjectName: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
   // required: true,
    trim: true
  }
});




var Subject = mongoose.model('Subject', SubjectChoiceSchema);
module.exports = Subject;
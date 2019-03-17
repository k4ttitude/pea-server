const exam = require('./exam.js');

const studentListPath = 'studentList.txt';
const examCodeListPath = 'examCode.txt';

// Add students
var lineReader = require('readline').Interface({
    input: require('fs').createReadStream(studentListPath)
});

lineReader.on('line', line => {
    // exam.addStudent(line);
    exam.addStudent(line);
});

// Add exam codes
lineReader = require('readline').Interface({
    input: require('fs').createReadStream(examCodeListPath)
});

lineReader.on('line', async line => {
    // exam.addExam(line);
    exam.addExam(line);
});

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/webdxd');  //specify db

var studentSchema = {
    firstname: String,
    lastname: String,
    gender: String,
    school: String,
    age: String,  //could be Number
    isEnrolled: Boolean  //could be String
}

var Students = mongoose.model('Students', studentSchema, 'students');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req);
  res.render('index', { title: 'WebDxD', author: 'Yan' });
});

/* GET students page. */
router.get('/students', function(req, res, next) {
  Students.find().exec(function(err, doc) {   //err is 1 or 2, doc is data retrieved from db
      //res.send(doc);  //send: directly send some string, doesn't convert to some HTML template
      //});
      res.render('students', {title: 'All Students', students: doc});
  });
});

/* POST add student. */
router.post('/students/add', function(req, res, next) {
    var newStudent = new Students(req.body);
    newStudent.save(function (err, doc) {
        res.render('studentDetail', {student: doc});
    });
});

/* GET add student form */
router.get('/students/add', function(req, res, next) {
    res.render('newStudent', {student: {}, action: '/students/add', title: 'Add New Student'});
});

/* GET student object and insert it into update form */
router.get('/students/update/:id', function(req, res, next) {
    Students.findById(req.params.id).exec(function(err, doc) {
        res.render('newStudent', {student: doc, action: '/students/update/' + doc._id, title: 'Update Student Info'});
    });
});
/* POST student object to current object in database */
router.post('/students/update/:id', function(req, res, next) {
    //console.log(req.body);  //req.body shouldn't have an id
    // var studentObj = req.body;       //these two lines are just showing how to add id to form
    // studentObj._id = req.params.id;  //params.id == :id
    //console.log(studentObj);
    Students.update({_id: req.params.id}, {$set: req.body}).exec(function(err, doc) {
        //console.log(doc) {
            if (err) {
                // handle err
            } else {
                //res.send(req.body);
                res.redirect('/students/' + req.params.id); //redirect to studentDetail page to reuse router
            }
        //};
    });
});

/* GET remove student by id. */
router.get('/students/remove/:id', function(req, res, next) {
    Students.remove({_id: req.params.id}, function(err, doc) {
        if (err) {
            //handle err
        } else {
            res.redirect('/students');  //fetch all students again except for the deleted entry
        }
    })
});

/* GET student detail by id. */
router.get('/students/:id', function(req, res, next) {
    //res.send(req.params.id);  //eg. http://localhost:3000/students/1, page displays 1
    Students.findById(req.params.id).exec(function(err, doc) {
        //res.send(doc);  //display json string
        res.render('studentDetail', {student: doc});
    });
});

/* POST a search/read request, one of CRUD (here, find student by name). */
router.post('/students/search', function(req, res, next) {
    //console.log(req.body.firstname);
    Students.find({'firstname': req.body.firstname}).exec(function(err, doc) {
        if (err) {  //db not connected, no matching result, syntax error
            //handle error
        } else {
            res.render('students', {title: 'Search Results', students: doc});
        }
    });
});

// /* POST add student. */
// router.post('/newStudents/add', function(req, res, next) {
//     console.log(req.body);
//     var newStudent = new Students(req.body);
//     newStudent.save(function (err, doc) {
//         res.render('studentDetail', {student: doc});
//     });
// });
//
// /* GET add student form */
// router.get('/newStudents/add', function(req, res, next) {  //can share the same endpoint as a POST request
//     res.render('newStudent', {});  //can pass in empty object b/c we're not reading data from db
// });


module.exports = router;

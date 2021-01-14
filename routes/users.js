var express = require('express');
var router = express.Router();
let usersCtrl = require("../controllers/users.js");

/* GET users listing. */
router.get('/', usersCtrl.index)
router.get('/habits', usersCtrl.showHabits)
router.get('/tasks', usersCtrl.showTasks)
router.get('/all', usersCtrl.showAll)
router.get("/role/:id", usersCtrl.roleDetail)
router.get("/habit/:id", usersCtrl.habitDetail)


router.post("/", usersCtrl.addRole)
router.delete('/delete/:id', usersCtrl.delRole);

router.post("/habit/new/:id", usersCtrl.addHabit)
router.put("/habit/:id", usersCtrl.editHabit)
router.put("/habit/complete/:id", usersCtrl.completeHabit);
router.put("/habit/incomplete/:id", usersCtrl.incompleteHabit);
router.delete("/habit/delete/:id", usersCtrl.delHabit)
router.put("/reset", usersCtrl.resetHabits);

router.post("/task/new/:id", usersCtrl.addTask)
router.delete("/task/delete/:id", usersCtrl.delTask)


function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;

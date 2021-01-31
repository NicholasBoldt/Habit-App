const User = require('../models/user');

module.exports = {
  index,
  addRole,
  delRole,
  roleDetail,
  addHabit,
  delHabit,
  habitDetail,
  editHabit,
  showHabits,
  addTask,
  delTask,
  showTasks,
  showAll,
  completeHabit,
  incompleteHabit,
  resetHabits
};

function index(req, res, next) {
  console.log(req.query)
  // Make the query object to use with Student.find based up
  // the user has submitted the search form or now
  let modelQuery = req.query.name ? {name: new RegExp(req.query.name, 'i')} : {};
  // Default to sorting by name
  let sortKey = req.query.sort || 'name';
  User.find(modelQuery)
  .sort(sortKey).exec(function(err, users) {
    if (err) return next(err);
    // Passing search values, name & sortKey, for use in the EJS
    res.render('users/index', {
        users,
        user: req.user,
        name: req.query.name,
        sortKey
      });
    });
  }

function addRole(req, res, next) {
    req.user.roles.push(req.body);
    req.user.save(function(err) {
      res.redirect('/users');
    });
}

function delRole(req, res, next) {
    console.log(req.user.roles);
    const idx = req.user.roles.findIndex(role => role.id === req.params.id);
    console.log(idx);
    req.user.roles.splice(idx, 1);
    req.user.save(function(err) {
        res.redirect('/users');
      });
}

function roleDetail(req, res, next) {
    req.user.roles.forEach(function(role) {
        if(role.id == req.params.id) {
            res.render('users/role', {role, calculateStreak: calculateStreak});
        }
    }); 
}

function addHabit(req, res, next) {
    req.user.roles.forEach(function(role) {
        if(role.id == req.params.id) {
            role.habits.push({name: req.body.habitName,
                            amount: req.body.habitAmount,
                            daily: req.body.habitDaily});
        }
    }); 
    req.user.save(function(err) {
        res.redirect('/users/role/' + req.params.id);
    });
}

function delHabit(req, res, next) {
    let roleID = "";
    req.user.roles.forEach(function(role) {
        console.log(role);
        const idx = role.habits.findIndex(habit => habit.id === req.params.id);
        console.log(idx);
        if(idx != -1) {
            role.habits.splice(idx, 1);
            roleID = role.id;
        }
    });
    req.user.save(function(err) {
        res.redirect('/users/role/' + roleID);
    });
}

function habitDetail(req, res, next) {
    req.user.roles.forEach(function(role) {
        role.habits.forEach(function(habit) {
            if(habit.id == req.params.id) {
                res.render('users/habit', {
                    role, 
                    habit,
                    calculateStreak: calculateStreak,
                });
            }
        });
    });
}

// calculate streak if given an array of dates in chronological order - ie., [5 days ago, 2 days ago, today]
function calculateStreak(dates) {
    let current_date = new Date()
    current_date.setHours(0,0,0,0)
    let streak = 0
    for (let i = dates.length -1; i >= 0; i--) {
        while(i >= 0 && dates[i].getTime() == current_date.getTime()) {
            streak++
            i--
            current_date.setDate(current_date.getDate() - 1)
        }
    }
    return Math.max(0, streak);
}

function editHabit(req, res, next) {
    let roleID = "";
    req.user.roles.forEach(function(role) {
        role.habits.forEach(function(habit) {
            const idx = role.habits.findIndex(habit => habit.id === req.params.id);
            if(habit.id === req.params.id) {
                roleID = role.id;
                habit.name = req.body.habitName
                habit.amount = req.body.habitAmount
                habit.daily = req.body.habitDaily
                req.user.save(function(err) {
                    res.redirect('/users/role/' + roleID);
                });
            }
        });
    });
}

function completeHabit(req, res, next) {
    req.user.roles.forEach(function(role) {
        role.habits.forEach(function(habit) {
            const idx = role.habits.findIndex(habit => habit.id === req.params.id);
            if(habit.id === req.params.id) {
                console.log(habit.completed);
                habit.completed = true;

                // Add today's date to this habit's completed_dates (if today isn't already there)
                // warning: these dates are all local server time. ideal:UTC
                // ideally, you'd ask the user for their timezone and store dates at usertime midnight for resetting correctly
                let today = new Date()
                today.setHours(0,0,0,0)
                today_exists_in_log = habit.completed_dates.some(date_in_log => date_in_log.getTime() == today.getTime())
                if (!today_exists_in_log) {
                    habit.completed_dates.push(today);
                }

                console.log(habit.completed);
                req.user.save(function(err) {
                    res.redirect(req.get("referer"));
                });
            }
        });
    });
}

function incompleteHabit(req, res, next) {
    req.user.roles.forEach(function(role) {
        role.habits.forEach(function(habit) {
            const idx = role.habits.findIndex(habit => habit.id === req.params.id);
            if(habit.id === req.params.id) {
                console.log(req.path);
                habit.completed = false;
                req.user.save(function(err) {
                    res.redirect(req.get("referer"));
                });
            }
        });
    });
}

function resetHabits(req, res, next) {
    req.user.roles.forEach(function(role) {
        role.habits.forEach(function(habit) {
                console.log(habit.completed);
                habit.completed = false;
                console.log(habit.completed);
        });
    });
    req.user.save(function(err) {
        res.redirect('/users');
    });
}

function showHabits(req, res, next) {
    let person = req.user;
    res.render('users/habits', {
        person,
        calculateStreak: calculateStreak,
    });
}



function addTask(req, res, next) {
    console.log("before");
    console.log(req.params.id);
    req.user.roles.forEach(function(role) {
        if(role.id == req.params.id) {
            role.tasks.push({name: req.body.taskName});
        }
    }); 
    req.user.save(function(err) {
        res.redirect('/users/role/' + req.params.id);
    });
}

function delTask(req, res, next) {
    let roleID = "";
    req.user.roles.forEach(function(role) {
        const idx = role.tasks.findIndex(task => task.id === req.params.id);
        console.log(idx);
        if(idx != -1) {
            roleID = role.id;
            role.tasks.splice(idx, 1);
        }
    });
    req.user.save(function(err) {
        res.redirect('/users/role/' + roleID);
    });
}

function showTasks(req, res, next) {
    let person = req.user;
    res.render('users/tasks', {person});
}

function showAll(req, res, next) {
    let person = req.user;
    res.render('users/all', {
        person,
        calculateStreak: calculateStreak,
    });
}
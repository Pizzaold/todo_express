const express = require('express');
const app = express();
const fs = require('fs');

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const tasks = JSON.parse(data);
            resolve(tasks);
        });
    });
};

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return
            }
            resolve(true)
        });
    });
}

app.get('/', (req, res) => {
    readFile('tasks.json')
        .then((tasks) => {
            res.render('index', { 
                tasks: tasks ,
                error: null
            });
        });
});

app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    let error = null
    if (req.body.task.trim().length == 0) {
        error = "Please insert correct task data"
        readFile('tasks.json')
            .then(tasks => {
                res.render("index", {
                    tasks: tasks,
                    error: error
                })
            })
    } else {
        readFile('tasks.json')
            .then(tasks => {
                let index
                if (tasks.length == 0) {
                    index = 0
                } else {
                    index = tasks[tasks.length - 1].id + 1
                }
                const newTask = {
                    "id": index,
                    "task": req.body.task
                }
                tasks.push(newTask)
                data = JSON.stringify(tasks, null, 2)
                writeFile('tasks.json', data)
                res.redirect('/');
            })
    }
})

app.get('/delete-task/:taskId', (req, res) => {
    let deleteTaskId = req.params.taskId
    readFile('tasks.json')
        .then(tasks => {
            if (deleteTaskId == "all") {
                tasks.forEach((task) => {
                    tasks.splice(task)
                })
            } else {
                tasks.forEach((task, index) => {
                if (task.id == deleteTaskId) {
                    tasks.splice(index, 1)
                }
            })
            }
            data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
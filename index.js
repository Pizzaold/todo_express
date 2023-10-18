const express = require('express');
const app = express();
const fs = require('fs');

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    fs.readFile('tasks.txt', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const tasks = data.split('\n');
        res.render('index', { tasks: tasks });
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
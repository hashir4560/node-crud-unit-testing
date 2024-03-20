const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = require('./app'); // assuming your Express app is exported from 'app.js'
// const usersRouter = require('./routes/users');

// const PORT = 3000;

// app.use(bodyParser.json());

// app.use('/users', usersRouter);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express')

const path = require('path')
const app = express();

const projectsRoutes = require('./routes/projects.route')
const contactsRoutes = require('./routes/contacts.route')
const usersRoutes = require('./routes/users.route')
const token = require('./routes/token.route')
const cv = require('./routes/cv.route')


app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(express.json())

const mongoose = require('mongoose');

mongoose.connect(process.env.URL).then(() => {
    console.log('connected successfuly')
});


app.use("/api/projects", projectsRoutes);

app.use("/api/contacts", contactsRoutes);

app.use("/api/users", usersRoutes)

app.use("/api", token)

app.use('/api/cv',cv)

app.listen(process.env.PORT, () => {
    console.log('listening on port 2020')
})
require('dotenv').config();
const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express();

const projectsRoutes = require('./routes/projects.route')
const contactsRoutes = require('./routes/contacts.route')
const usersRoutes = require('./routes/users.route')
const token = require('./routes/token.route')
const cv = require('./routes/cv.route')
const avatar = require('./routes/avatar.route')
const availableData = require('./routes/availableData.route')

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));


app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(express.json())

const mongoose = require('mongoose');

mongoose.connect(process.env.URL).then(() => {
    console.log('connected successfuly')
});


app.use("/api/projects", projectsRoutes);
app.use("/", (req,res)=>{
    res.send("hello")
})

app.use("/api/contacts", contactsRoutes);

app.use("/api/users", usersRoutes)

app.use("/api", token)

app.use('/api/cv',cv)

app.use('/api',avatar)

app.use('/api',availableData)

app.listen(process.env.PORT, () => {
    console.log('listening on port 2020')
})
const express = require("express")
const app = express()
const port = 3001
const Joi = require('joi');
const cors = require('cors');
app.use(cors())

const fs = require('fs'); // read from files
var jsonData = fs.readFileSync('dataFromFile.json');
var dataFromFile = JSON.parse(jsonData);

app.use(express.json()) // body parser
app.use(express.urlencoded({ extended: true }))

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');
class Person extends Model {};

Person.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    completed: { type: DataTypes.BOOLEAN },

}, {
    sequelize,
    modelName: 'Person'
});

async function createTable() {
    await Person.sync();
    await Person.bulkCreate(dataFromFile, { validate: true });
}

createTable();

// request function

app.get("/", async(req, res) => { // get all task of toDoList
    await Person.sync();
    let personList = await Person.findAll();
    let content = personList.map(x => x.toJSON())
    res.send(content)
})

app.post("/", async(req, res) => { // post and  create a new task

    if (isValidTask(req.body)) {
        await Person.sync();
        await Person.create({ title: req.body.title, completed: req.body.completed });
        res.status(200)
    } else {
        res.status(405)
            .send("New task not valid")
    }
})

app.put("/:id", async(req, res) => { // put  upgrate a task

    !/^[0-9]+$/.test(req.params.id) && res.status(400).send(" Invalid ID format supplied")

    if (isValidTask(req.body)) {
        await Person.sync();
        await Person.update({ completed: req.body.completed }, { where: { id: req.params.id } });
        res.status(200)
    } else {
        res.status(405)
            .send("Update task not valid", req.body)
    }
})

app.delete("/:id", async(req, res) => {

    !/^[0-9]+$/.test(req.params.id) && res.status(400).send(" Invalid ID format supplied")
    await Person.destroy({ where: { id: req.params.id } })
    res.send(200)
})

// joi valid scheme
const isValidTask = (task) => {
    const taskSchema = Joi.object({
        title: Joi.string().required(),
        completed: Joi.boolean().required()
    })

    return taskSchema.validate(task).error ? false : true;
}

app.listen(port)
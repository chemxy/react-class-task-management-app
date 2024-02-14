import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

import jwt from 'jsonwebtoken'

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
//
// app.get('/login', async (req, res) => {
//     let token;
//     try {
//         //Creating jwt token
//         token = jwt.sign(
//             {username: "sampleusername", password: "samplepass"},
//             "expressjs",
//             {expiresIn: "1h"}
//         );
//     } catch (err) {
//         console.log(err);
//         const error = new Error("Error! Something went wrong with the authentication.");
//         return next(error);
//     }
//
//     res.status(200).json({message: 'authenticated', token: token})
// })

app.get('/projects', async (req, res) => {
    console.log("get projects")
    const fileContent = await fs.readFile('./data/projects.json');

    const projectsData = JSON.parse(fileContent);

    res.status(200).json({projects: projectsData});
});

app.get('/projects/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    console.log("get projects with id " + projectId)
    const fileContent = await fs.readFile('./data/projects.json');

    const projectsData = JSON.parse(fileContent);

    const project = projectsData.find((project) => project.id === projectId)

    res.status(200).json({project: project});
});

app.post('/project', async (req, res) => {
    console.log("add project")
    const data = req.body;
    console.log(data)
    if (JSON.stringify(data) === '{}') {
        console.log("invalid input data")
        res.status(500).json({message: 'empty payload'})
    } else {
        console.log(data)
        const fileContent = await fs.readFile('./data/projects.json');
        const projectsData = JSON.parse(fileContent);
        data.id = Math.random().toString(36).replace('.', '');
        projectsData.push({...data});
        await fs.writeFile('./data/projects.json', JSON.stringify(projectsData));
        res.status(200).json({message: 'project saved.', project: data});
    }
});

app.post('/deleteproject', async (req, res) => {
    console.log("deleting project")
    const data = req.body;
    // console.log(data)
    if (JSON.stringify(data) === '{}') {
        console.log("invalid input data")
        res.status(500).json({message: 'empty payload'})
    } else {
        const fileContent = await fs.readFile('./data/projects.json');
        const projectsData = JSON.parse(fileContent);
        const newProjects = projectsData.filter((project) => project.id !== data.id);
        await fs.writeFile('./data/projects.json', JSON.stringify(newProjects));
        res.status(200).json({message: 'project deleted.'});
    }
});

// 404
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    res.status(404).json({message: '404 - Not Found'});
});

console.log("listening to port 3200")
app.listen(3200);

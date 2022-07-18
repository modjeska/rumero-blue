// node packages
const express = require('express')
const fs = require('fs')
const { join } = require('path')
const { uid } = require('uid')
// connections
const app = express()
let noteData = require('./db/db.json')
// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(join(__dirname, 'public')))
// paths
app.get('/', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')))
app.get('/notes', (req, res) => res.sendFile(join(__dirname, 'public', 'notes.html')))
app.get('/api/notes', (req, res) => res.json(noteData))
app.post('/api/notes', (req, res) => {
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uid(),
    }
    noteData.push(newNote)
    fs.writeFile(join(__dirname, 'db', 'db.json'), JSON.stringify(noteData), err => {
        if (err) {console.log(err)}
        res.json(newNote)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    noteData = noteData.filter(note => note.id != req.params.id)
    fs.writeFile(join(__dirname, 'db', 'db.json'), JSON.stringify(noteData), err => {
        if (err) {console.log(err)}
        res.sendStatus(200)
    })
})
// port
app.listen(process.env.PORT || 3001)
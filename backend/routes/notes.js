express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
var fetchUser = require('../middleware/fetchUser');

//Route 1 : Get all the notes using : GET "/api/notes/fetchallnotes"  Login Required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }

});

//Route 2 : Add a new note using post : POST "/api/notes/addnote"  Login Required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleasts 5 characters').isLength({ min: 5 })
],

    async (req, res) => {
        try {
            const { title, description, tag } = req.body
            //If there are errors , Return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });

//Route 3 : Update an existing note using  : put "/api/notes/updatenote"  Login Required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 4: Delete an existing note  : Del"/api/notes/deletenote"  Login Required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Find the note to be updated and delet it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        //allow deletion only if user owns this note
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "note has been deleted ", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router
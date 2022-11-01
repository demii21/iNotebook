import NoteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []


    const [notes, setnotes] = useState(notesInitial);

    //GET ALL NOTES
    const getNotes = async () => {
        //TODO: API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();
        console.log(json);
        setnotes(json);
    }
    //Add a Note
    const addNote = async (title, description, tag) => {
        //TODO: API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });

        console.log("Adding new note")
        const note = await response.json();
        setnotes(notes.concat(note)); 
        
    }
    //Delete a Note
    const deleteNote = async (id) => {
        //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        console.log("Deleting the note with" + id);
        const newNotes = notes.filter((note) => { return note._id !== id });
        setnotes(newNotes);
        const json = await response.json();
        console.log(json)
    }


    //Edit a Note
    const editNote = async (id, title, description, tag) => {
        //API CALL

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });
        const json = await response.json();
        console.log(json);

        let newNotes = JSON.parse(JSON.stringify(notes));
        //LOGIC TO EDIT IN CLIENT
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                 break;
            }
           
        }
        console.log(newNotes);
        setnotes(newNotes);
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
};

export default NoteState;
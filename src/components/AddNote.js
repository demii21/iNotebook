import React,{useContext,useState} from 'react'
import noteContext from '../context/Notes/noteContext';
const AddNote = (props) => {
    const context = useContext(noteContext);
    //eslint-disable-next-line
    const {addNote} = context;
    const [note, setnote] = useState({title:"",description:"",tag:"default"});
    const handleClick = (e) =>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setnote({title:"",description:"",tag:"default"})
        props.showAlert(":Added Successfully","success")
    }
    const onChange = (e) => {
        setnote({...note,[e.target.name]:e.target.value})
    }

    return (
        <div>
            <div className="container my-3">
                <h2>Add a note</h2>
                <form className='my-3'>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title"  name="title" aria-describedby="emailHelp" value={note.title}  placeholder="Enter Title"  onChange={onChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" className="form-control" id="description" value={note.description} placeholder="description" onChange={onChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">tag</label>
                        <input type="text" name="tag" className="form-control" id="tag" placeholder="tag" value={note.tag} onChange={onChange} required/>
                    </div>
            
                    <button type="submit" disabled={note.title.length<5||note.description.length<5} className="btn btn-primary my-2" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
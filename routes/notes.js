const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Notes = require('../models/Notes');
const { body, validationResult } = require("express-validator");


//Route 1: from here we can fetch all nodes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


//Route 2: from here we can add notes

router.post('/addnotes',fetchuser,[
    body("title").isLength({min:3}),
    body("description",'Please write the description with atleast length 5 ').isLength({min:5})
],async (req,res)=>{

   const errors=validationResult(req);
   if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
   }

   try {

    const {title,description,tag} = req.body;
    const notes=new Notes({
        title,description,tag,user:req.user.id
    })

    const savedNotes=await notes.save();
    res.json(savedNotes);
    
   } catch (error) {
        res.status(500).send("Internal Server Error");
   }


});


//Route 3: from here we can update notes based on their id

router.put('/updatenotes/:id',fetchuser,async (req,res)=>{

    try {
        const {title,description,tag}=req.body;
        //creating new note
        const newNote={};

        //filling the given values in the newnote
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        //find note
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(400).send("Note Does not exists");
        }

        //validate the note with user
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed");
        }

        //now update the note

        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json(note);



        
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


//Route 4: from here you can delete the note

router.delete('/deletenote/:id',fetchuser,async (req,res)=>{

    try {

    //validating the note
     let note=await Notes.findById(req.params.id);
     if(!note){
        return res.status(400).send("Note does not exist");
     }

    //validating the user
     if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not allowed");
     }

    //deleting the node
     note=await Notes.findByIdAndDelete(req.params.id);
     res.json({"Success":`Note "${note.title}" has been deleted`});

        
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;

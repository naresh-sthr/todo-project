const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

mongoose.connect('mongodb+srv://nareshsuthardev:nareshsthr@cluster0.nszkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log("Mongodb Connected"))
.catch(err=>console.log("Error",err));

app.listen((PORT),()=>console.log("Server is running on port: ",PORT));

const todoSchema = new mongoose.Schema({
    todoText : {
        type: String,
        require: true
    },
    isCompleted : {
        type: Boolean,
        default : false
    }
},{timestamps: true});

const todo = mongoose.model('todo',todoSchema);

app.get('/',async(req,res)=>{
    try{
        const todoList = await todo.find();
        res.status(200).json(todoList);
    }catch(err){
        res.status(400).json({Msg : `Error ${err}`});
    }
});

app.post('/',async(req,res)=>{
    try{
        const {todoText,isCompleted} = req.body;
        console.log(req.body)
        const createTodo = new todo({todoText,isCompleted});
        await createTodo.save();
        res.status(200).json({Msg : "Created"});
    }catch(err){
        res.status(400).json({Msg : `Error ${err}`});
    }
})

app.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { isCompleted } = req.body;
  
      const updatedTodo = await todo.findByIdAndUpdate(id, { isCompleted }, { new: true });
  
      res.status(200).json(updatedTodo); // Send back the updated todo
    } catch (err) {
      res.status(400).json({ Msg: `Error: ${err}` });
    }
  });

  app.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTodo = await todo.findByIdAndDelete(id);  // Delete the todo by ID
  
      if (deletedTodo) {
        res.status(200).json({ Msg: "Todo deleted successfully", deletedTodo });
      } else {
        res.status(404).json({ Msg: "Todo not found" });
      }
    } catch (err) {
      res.status(400).json({ Msg: `Error: ${err}` });
    }
  });
  
  app.patch('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { todoText,isCompleted } = req.body;
  
      const updatedTodo = await todo.findByIdAndUpdate(id, { isCompleted,todoText }, { new: true });
  
      res.status(200).json(updatedTodo); // Send back the updated todo
    } catch (err) {
      res.status(400).json({ Msg: `Error: ${err}` });
    }
  });
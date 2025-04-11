import React, { useEffect, useState } from "react";
import "../App.css";

const API = "https://todo-backend-d0zs.onrender.com/";

const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [text, setText] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTodo(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo
  const createTodo = async () => {
    if (text.trim() === "") return;

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todoText: text }),
      });

      const result = await response.json();
      console.log(result);

      setText(""); // Clear input
      fetchTodos(); // Re-fetch updated list
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Toggle complete/incomplete
  const toggleComplete = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle true/false
      const response = await fetch(`${API}${id}`, {
        method: "PATCH", // Use PATCH for partial update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: updatedStatus }),
      });

      const result = await response.json();
      console.log(result);

      // Optimistically update state to avoid re-fetch
    //   setTodo(todo.map(item =>
    //     item._id === id ? { ...item, isCompleted: updatedStatus } : item
    //   ));
    fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  async function deleteTodo(todoId) {
    try {
      const response = await fetch(`${API}${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const result = await response.json();
      console.log(result);  // To see the result after deletion
  
      // Re-fetch the updated todos list
      fetchTodos(); 
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <>
      <div className="container">
        <input
          className="input"
          type="text"
          placeholder="Enter your todo here..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button className="button" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
  {todo.map((item) => (
    <li key={item._id} className={item.isCompleted ? "completed" : ""} id="list">
      <span onClick={() => toggleComplete(item._id, item.isCompleted)}>
        {item.todoText} - {item.isCompleted ? "✅ Done" : "❌ Not done"}
      </span>
      
      {/* Add delete button */}
      <button onClick={() => deleteTodo(item._id)} className="button">Delete</button>
    </li>
  ))}
</ul>

    </>
  );
};

export default Todo;

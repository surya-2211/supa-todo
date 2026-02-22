import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editId) {
      await supabase.from("todo").update({ name }).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("todo").insert([
        { name, isCompleted: false }
      ]);
    }

    setName("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await supabase.from("todo").delete().eq("id", id);
    fetchTodos();
  };

  const editTodo = (todo) => {
    setName(todo.name);
    setEditId(todo.id);
  };

  const toggleComplete = async (todo) => {
    await supabase
      .from("todo")
      .update({ isCompleted: !todo.isCompleted })
      .eq("id", todo.id);

    fetchTodos();
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Todo List</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter todo..."
          />
          <button type="submit">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        <ul className="list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className="left">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleComplete(todo)}
                />

                <span className={todo.isCompleted ? "completed" : ""}>
                  {todo.name}
                </span>
              </div>

              <div className="actions">
                <button onClick={() => editTodo(todo)}>Edit</button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
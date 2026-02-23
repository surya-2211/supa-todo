import { useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

export default function TodoApp() {
  const { user } = useContext(AuthContext);

  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch todos (optimized with useCallback)
  const fetchTodos = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (!error) setTodos(data || []);

    setLoading(false);
  }, [user]);

  // ✅ Proper dependency fix
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ✅ Add Todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    await supabase.from("todo").insert([
      {
        name,
        isCompleted: false,
        user_id: user.id,
      },
    ]);

    setName("");
    fetchTodos();
  };

  // ✅ Toggle completion
  const toggleTodo = async (todo) => {
    await supabase
      .from("todo")
      .update({ isCompleted: !todo.isCompleted })
      .eq("id", todo.id);

    fetchTodos();
  };

  // ✅ Delete todo
  const deleteTodo = async (id) => {
    await supabase.from("todo").delete().eq("id", id);
    fetchTodos();
  };

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Todo List</h2>

        <button className="btn secondary" onClick={logout}>
          Logout
        </button>

        {/* Add Todo */}
        <form onSubmit={addTodo}>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New todo..."
          />
          <button className="btn primary" disabled={!name.trim()}>
            Add
          </button>
        </form>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Todo List */}
        {!loading &&
          todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <div>
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleTodo(todo)}
                />
                <span
                  style={{
                    marginLeft: "10px",
                    textDecoration: todo.isCompleted
                      ? "line-through"
                      : "none",
                  }}
                >
                  {todo.name}
                </span>
              </div>

              <button
                className="btn danger"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))}

        {!loading && todos.length === 0 && <p>No todos yet.</p>}
      </div>
    </div>
  );
}
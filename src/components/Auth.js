import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../App.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check email to confirm!");
  };

  const login = async () => {
    const { error } =
      await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Login / Signup</h2>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn primary" onClick={login}>
          Login
        </button>

        <button className="btn secondary" onClick={signUp}>
          Signup
        </button>
      </div>
    </div>
  );
}
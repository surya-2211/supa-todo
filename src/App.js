import { useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Auth from "./components/Auth";
import TodoApp from "./components/TodoApp";

function MainApp() {
  const { user } = useContext(AuthContext);

  return user ? <TodoApp /> : <Auth />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
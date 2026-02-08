import { Routes, Route } from "react-router-dom";
// import { PublicRoute } from "./route/PublicRoute";
// import { ProtectedRoute } from "./route/ProtectedRoute";

import UserRegister from "./pages/auth/UserRegister";
import UserLogin from "./pages/auth/UserLogin";
import ExpenseMain from "./pages/ExpenseMain"

function App() {
    return (
        <Routes>
            <Route path="/register" element={<UserRegister />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/expense" element={<ExpenseMain />} />
        </Routes>
    );
}

export default App;

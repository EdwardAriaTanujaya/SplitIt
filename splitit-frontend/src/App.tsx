import { Routes, Route } from "react-router-dom";
// import { PublicRoute } from "./route/PublicRoute";
// import { ProtectedRoute } from "./route/ProtectedRoute";

import UserRegister from "./pages/auth/UserRegister";
import UserLogin from "./pages/auth/UserLogin";
import ExpenseMain from "./pages/ExpenseMain.tsx";
import FriendMain from "./pages/FriendMain.tsx";

function App() {
    return (
        <Routes>
            <Route path="/register" element={<UserRegister />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/expense" element={<ExpenseMain />} />
            <Route path="/friends" element={<FriendMain />} />
        </Routes>
    );
}

export default App;

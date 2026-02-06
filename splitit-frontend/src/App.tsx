import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./route/PublicRoute";
import { ProtectedRoute } from "./route/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                {/* Public routes here */}
            </Route>
            <Route element={<ProtectedRoute />}>
                {/* Protected routes here */}
            </Route>
        </Routes>
    );
}

export default App;

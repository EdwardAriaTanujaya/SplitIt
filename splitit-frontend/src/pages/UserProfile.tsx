import { UserRound, UsersRound, LogOut } from "lucide-react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Header from "../components/header/Header";
import useUserAuth from "../store/UserAuthStore";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const user = useUserAuth((s) => s.user);
  const logout = useUserAuth((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <UserRound className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-gray-500 mb-8">{user?.email}</p>

        <div className="w-full space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 mb-1">USER ID (Share this to your friends)</p>
                <p className="text-sm font-mono bg-white p-2 border border-gray-200 rounded-lg select-all">{user?.id}</p>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white h-16 w-screen border-t border-gray-200 flex flex-row z-40">
        <a className="flex flex-col flex-1 items-center justify-center" href="/expense">
          <BanknotesIcon className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Expenses</p>
        </a>
        <a className="flex flex-col flex-1 items-center justify-center" href="/friends">
          <UsersRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Friends</p>
        </a>
        <a className="flex flex-col flex-1 items-center justify-center" href="/profile">
          <UserRound className="w-6 h-6 text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold">Profile</p>
        </a>  
      </div>
    </div>
  );
}

export default UserProfile;

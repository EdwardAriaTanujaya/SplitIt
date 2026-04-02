import { UserRound, UsersRound, LogOut } from "lucide-react";
import {
  BanknotesIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/header/Header";
import useUserAuth from "../store/UserAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function UserProfile() {
  const user = useUserAuth((s) => s.user);
  const logout = useUserAuth((s) => s.logout);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <p className="text-xs font-bold text-gray-400 mb-1">
              USER ID (Share this to your friends)
            </p>
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <span className="flex-1 text-sm font-mono px-3 py-3 text-gray-700 break-all select-all">
                {user?.id}
              </span>
              <button
                onClick={handleCopy}
                className="flex h-full items-center justify-center px-4 border-l border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                title="Copy ID"
              >
                {copied ? (
                  <span className="flex items-center text-green-500 text-xs font-bold">
                    <CheckIcon className="w-5 h-5" />
                  </span>
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5" />
                )}
              </button>
            </div>
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
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/expense"
        >
          <BanknotesIcon className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Expenses</p>
        </Link>
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/friends"
        >
          <UsersRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Friends</p>
        </Link>
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/profile"
        >
          <UserRound className="w-6 h-6 text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold">Profile</p>
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;

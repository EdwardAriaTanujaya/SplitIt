import { UserRound, UsersRound, Plus, X, UserPlus } from "lucide-react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import HeaderTagline from "../components/header/HeaderTagline";
import { useState, useEffect } from "react";
import Header from "../components/header/Header";
import useFriendStore from "../store/FriendStore";
import useUserAuth from "../store/UserAuthStore";

function FriendMain() {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [showAddModal, setShowAddModal] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState("");
  
  const user = useUserAuth((s) => s.user);
  const { pendingRequests, fetchFriends, sendRequest, respondToRequest, loading } = useFriendStore();

  useEffect(() => {
    if (user) {
      fetchFriends(user.id);
    }
  }, [user, fetchFriends]);

  const handleSendRequest = async () => {
    if (!friendIdInput || !user) return;
    try {
        await sendRequest(user.id, friendIdInput);
        setShowAddModal(false);
        setFriendIdInput("");
        alert("Friend request sent!");
    } catch (error) {
        console.error("Failed to send request", error);
    }
  };

  const handleRespond = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
        await respondToRequest(requestId, status);
        if (user) fetchFriends(user.id);
    } catch (error) {
        console.error("Failed to respond to request", error);
    }
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
        <Header />

        <HeaderTagline 
          title="Your Friends"
          subtitle="Manage your friends and remind them"
          onChange={setSearch}
          value={search}
          placeholder="Search friends"
        />

        {/* Tabs - Matches Figma Image 4 */}
        <div className="flex px-4 mt-6 gap-0 bg-blue-100 rounded-2xl mx-4 p-1">
            <button 
                onClick={() => setActiveTab("requests")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "requests" ? "bg-blue-600 text-white shadow-md" : "text-blue-600"}`}
            >
                Add new friend
            </button>
            <button 
                onClick={() => setActiveTab("friends")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "friends" ? "bg-blue-600 text-white shadow-md" : "text-blue-600"}`}
            >
                Friends
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-20 mt-4">
            {activeTab === "friends" && (
                <div className="flex flex-col items-center justify-center h-full mt-[-80px]">
                    <img
                        src="/FriendLogo.png"
                        alt="Friend Logo"
                        className="w-32 h-32 object-contain"
                    />
                    <p className="text-base font-bold text-black mt-4">
                        You don't have any friends yet.
                    </p>
                    <p className="text-sm text-[var(--color-lightgray)]">Add friends to get started</p>
                </div>
            )}

            {activeTab === "requests" && (
                <div className="space-y-3">
                    {pendingRequests.length === 0 && <p className="text-center text-gray-400 mt-10">No pending requests</p>}
                    {pendingRequests.map((req) => (
                        <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {req.user.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{req.user.name}</p>
                                    <p className="text-xs text-gray-400">wants to be your friend</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleRespond(req.id, "ACCEPTED")} className="p-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4"/></button>
                                <button onClick={() => handleRespond(req.id, "REJECTED")} className="p-2 bg-gray-100 text-gray-400 rounded-lg"><X className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">
                <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <UserPlus className="w-12 h-12 text-blue-600 mb-2" />
                    <h2 className="text-xl font-bold">Add New Friend</h2>
                    <p className="text-sm text-gray-500 text-center">Enter your friend's ID to connect</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">USER ID</label>
                        <input 
                            value={friendIdInput}
                            onChange={(e) => setFriendIdInput(e.target.value)}
                            placeholder="Paste friend ID here" 
                            className="w-full bg-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button 
                        onClick={handleSendRequest}
                        className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200 active:bg-blue-700 mt-2"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 rounded-full w-14 h-14 flex justify-center items-center shadow-lg shadow-blue-200 active:scale-90 transition-transform cursor-pointer"
        >
          <Plus className="text-white w-8 h-8"></Plus>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white h-16 w-screen border-t border-gray-200 flex flex-row z-40">
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/expense"
        >
          <BanknotesIcon className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">
            Expenses
          </p>
        </a>
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/friends"
        >
          <UsersRound className="w-6 h-6 text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold">
            Friends
          </p>
        </a>
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/profile"
        >
          <UserRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">
            Profile
          </p>
        </a>
      </div>
    </div>
  );
}

export default FriendMain;

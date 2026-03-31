import { UserRound, UsersRound, Plus, X, UserRoundPlus } from "lucide-react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import HeaderTagline from "../components/header/HeaderTagline";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import useFriendStore from "../store/FriendStore";
import useUserAuth from "../store/UserAuthStore";

function FriendMain() {
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState("");
  
  const user = useUserAuth((s) => s.user);
  const { pendingRequests, acceptedFriends, fetchFriends, sendRequest, respondToRequest, loading } = useFriendStore();

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

  const handleRespond = async (requestId: string, status: "ACCEPTED" | "DECLINED") => {
    if (!user) return;
    try {
        await respondToRequest(user.id, requestId, status);
        fetchFriends(user.id);
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

        <div className="flex-1 overflow-y-auto px-4 pb-20 mt-4">
            {loading && <p className="text-center text-sm text-gray-500">Loading friends...</p>}

            {!loading && acceptedFriends.length > 0 && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Accepted Friends</h3>
                  <div className="space-y-3">
                    {acceptedFriends.map((friend) => (
                      <div key={friend.friendId} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <div>
                          <p className="font-bold text-gray-800">{friend.friend.name}</p>
                          <p className="text-[11px] text-gray-500">{friend.friend.email}</p>
                        </div>
                        <span className="text-[11px] text-green-600 font-semibold">Friend</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && pendingRequests.length > 0 && (
              <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Pending Requests</h3>
                <div className="space-y-3">
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-800">{request.user.name}</p>
                          <p className="text-[11px] text-gray-500">{request.user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRespond(request.id, 'ACCEPTED')}
                            className="rounded-2xl bg-green-600 px-3 py-2 text-[11px] font-bold text-white"
                          >Accept</button>
                          <button
                            onClick={() => handleRespond(request.id, 'DECLINED')}
                            className="rounded-2xl bg-red-600 px-3 py-2 text-[11px] font-bold text-white"
                          >Decline</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && acceptedFriends.length === 0 && pendingRequests.length === 0 && (
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
        </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">
                <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 cursor-pointer">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <UserRoundPlus className="w-12 h-12 text-blue-600 mb-2" />
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
                        className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200 active:bg-blue-700 mt-2 cursor-pointer transition-colors"
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
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/expense"
        >
          <BanknotesIcon className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">
            Expenses
          </p>
        </Link>
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/friends"
        >
          <UsersRound className="w-6 h-6 text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold">
            Friends
          </p>
        </Link>
        <Link
          className="flex flex-col flex-1 items-center justify-center"
          to="/profile"
        >
          <UserRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">
            Profile
          </p>
        </Link>
      </div>
    </div>
  );
}

export default FriendMain;

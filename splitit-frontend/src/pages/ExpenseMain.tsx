import { UserRound, UsersRound, ChevronRight, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import HeaderTagline from "../components/header/HeaderTagline";
import Header from "../components/header/Header";
import useGroupStore from "../store/GroupStore";
import useUserAuth from "../store/UserAuthStore";
import useFriendStore from "../store/FriendStore";

const GROUP_CATEGORIES = [
  { id: 'food', label: 'Food', image: '/food.svg' },
  { id: 'electricity', label: 'Electricity', image: '/electricity.svg' },
  { id: 'household', label: 'Household', image: '/household.svg' },
  { id: 'bills', label: 'Other Bills', image: '/bills.svg' },
];

function ExpenseMain() {
  const [search, setSearch] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [friendSearch, setFriendSearch] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(GROUP_CATEGORIES[0].id);
  
  const user = useUserAuth((s) => s.user);
  const { groups, fetchGroups, createGroup, loading } = useGroupStore();
  const { acceptedFriends, fetchFriends } = useFriendStore();

  useEffect(() => {
    if (user) {
      fetchGroups(user.id);
      fetchFriends(user.id);
    }
  }, [user, fetchGroups, fetchFriends]);

  const handleCreateGroup = async () => {
    if (!newGroupName || !user || selectedMemberIds.length === 0) return;
    const selectedCategoryData = GROUP_CATEGORIES.find((item) => item.id === selectedCategory);
    try {
        await createGroup(
            newGroupName,
            selectedMemberIds,
            user.id,
            selectedCategoryData?.image,
        );
        setShowCreateModal(false);
        setFriendSearch("");
        setNewGroupName("");
        setSelectedMemberIds([]);
        setSelectedCategory(GROUP_CATEGORIES[0].id);
        fetchGroups(user.id);
    } catch (error) {
        console.error("Failed to create group", error);
    }
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  const filteredFriends = acceptedFriends.filter((friend) =>
    friend.friend.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
    friend.friend.email.toLowerCase().includes(friendSearch.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <HeaderTagline
        title="Your Groups"
        subtitle="Manage your groups and expenses"
        onChange={setSearch}
        value={search}
        placeholder="Search groups"
      />

      <div className="flex-1 overflow-y-auto px-4 pb-20 mt-4">
        {loading && <p className="text-center">Loading groups...</p>}
        
        {!loading && filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full mt-[-50px]">
            <img
              src="/GroupLogo.png"
              alt="Group Logo"
              className="w-32 h-32 object-contain"
            />
            <p className="text-base font-bold text-black mt-4">
              {groups.length === 0 && search.trim() === "" ? "You don't have any groups yet." : "No groups match your search."}
            </p>
            <p className="text-sm text-[var(--color-lightgray)]">
              {groups.length === 0 && search.trim() === "" ? "Join or create one to get started" : "Try another group name."}
            </p>
          </div>
        )}

        {!loading && filteredGroups.map((group) => (
          <div key={group.id} className="rounded-3xl border border-gray-100 bg-white w-full p-4 mb-4 shadow-sm flex items-center justify-between transition-transform active:scale-95">
             <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img
                      src={group.groupImage || '/GroupLogo.png'}
                      alt="Group Icon"
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="pt-1">
                    <p className="text-lg font-bold text-gray-800">{group.name}</p>
                    <div className="flex items-center mt-1 -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-red-600">J</div>
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">M</div>
                        <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-green-600">A</div>
                        <span className="text-[10px] text-gray-400 font-bold ml-4">{(group as any)._count?.members || 0} Members</span>
                    </div>
                </div>
             </div>
             <ChevronRight className="w-6 h-6 text-gray-900" />
          </div>
        ))}
      </div>
     
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 cursor-pointer">
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center mb-6">
              <img src="/Groups.png" alt="Group Logo" className="w-12 h-12 mb-4" />
              {modalStep === 1 ? (
                <>
                  <h2 className="text-xl font-bold">Add Your Friends</h2>
                  <p className="text-sm text-gray-500 text-center">Select friends to add to your group</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Name Your Group</h2>
                  <p className="text-sm text-gray-500 text-center">Give your group a name and create it</p>
                </>
              )}
            </div>

            <div className="space-y-4">
              {modalStep === 1 ? (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-2">SEARCH CONNECTED FRIENDS</p>
                  <input
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    placeholder="Search friend name or email"
                    className="w-full bg-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  <p className="text-xs text-gray-500 mb-2">Select one or more friends first, then continue.</p>

                  {acceptedFriends.length === 0 ? (
                    <p className="text-sm text-[var(--color-error)]">You have no accepted friends yet. Invite friends first to add them to groups.</p>
                  ) : filteredFriends.length === 0 ? (
                    <p className="text-sm text-gray-500">No connected friends match your search.</p>
                  ) : (
                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {filteredFriends.map((friend) => (
                        <label key={friend.friendId} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer">
                          <div>
                            <p className="font-bold text-gray-800">{friend.friend.name}</p>
                            <p className="text-[11px] text-gray-500">{friend.friend.email}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedMemberIds.includes(friend.friendId)}
                            onChange={() => {
                              setSelectedMemberIds((current) =>
                                current.includes(friend.friendId)
                                  ? current.filter((id) => id !== friend.friendId)
                                  : [...current, friend.friendId]
                              );
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">Selected Friends</p>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {acceptedFriends
                        .filter((friend) => selectedMemberIds.includes(friend.friendId))
                        .map((friend) => (
                          <div key={friend.friendId} className="rounded-2xl bg-white p-3 border border-gray-200">
                            <p className="font-bold text-gray-800">{friend.friend.name}</p>
                            <p className="text-[11px] text-gray-500">{friend.friend.email}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">GROUP NAME</label>
                    <input
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., KFC Party Part 2"
                      className="w-full bg-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-400">CATEGORY</p>
                      <p className="text-[11px] text-gray-500">Choose an icon for the group.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {GROUP_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer ${selectedCategory === category.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-100'} transition`}
                        >
                          <img src={category.image} alt={category.label} className="w-8 h-8" />
                          <span className="text-sm font-bold text-gray-700">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 cursor-pointer active:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                {modalStep === 1 ? (
                  <button
                    onClick={() => setModalStep(2)}
                    disabled={selectedMemberIds.length === 0}
                    className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200 cursor-pointer active:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setModalStep(1)}
                      className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 active:bg-gray-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCreateGroup}
                      disabled={newGroupName.trim().length === 0}
                      className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200 active:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      Create
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Plus Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <button 
            onClick={() => {
              setModalStep(1);
              setFriendSearch("");
              setNewGroupName("");
              setSelectedMemberIds([]);
              setSelectedCategory(GROUP_CATEGORIES[0].id);
              setShowCreateModal(true);
            }}
            className="bg-blue-600 rounded-full w-14 h-14 flex justify-center items-center shadow-lg shadow-blue-200 active:scale-90 transition-transform cursor-pointer"
        >
          <Plus className="text-white w-8 h-8"></Plus>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white h-16 w-screen border-t border-gray-200 flex flex-row z-40">
        <Link className="flex flex-col flex-1 items-center justify-center" to="/expense">
          <BanknotesIcon className="w-6 h-6 text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold">Expenses</p>
        </Link>
        <Link className="flex flex-col flex-1 items-center justify-center" to="/friends">
          <UsersRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Friends</p>
        </Link>
        <Link className="flex flex-col flex-1 items-center justify-center" to="/profile">
          <UserRound className="w-6 h-6 text-gray-400" />
          <p className="text-[10px] text-gray-400 font-bold">Profile</p>
        </Link>  
      </div>

    </div>
  );
}

export default ExpenseMain;

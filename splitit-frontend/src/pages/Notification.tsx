import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFriendStore from "../store/FriendStore";
import useUserAuth from "../store/UserAuthStore";

function Notification() {
  const navigate = useNavigate();
  const user = useUserAuth((s) => s.user);
  const { notifications, fetchNotifications, respondToRequest, loading } = useFriendStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  const handleRespond = async (requestId: string, status: "ACCEPTED" | "DECLINED") => {
    if (!user) return;
    try {
      await respondToRequest(user.id, requestId, status);
      fetchNotifications(user.id);
    } catch (error) {
      console.error("Failed to respond to notification", error);
    }
  };

  const renderActions = (notification: any) => {
    switch (notification.type) {
      case "FRIEND_REQUEST":
        return (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleRespond(notification.id, "ACCEPTED")}
              className="flex-1 rounded-2xl bg-green-600 py-3 text-sm font-bold text-white"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespond(notification.id, "DECLINED")}
              className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white"
            >
              Decline
            </button>
          </div>
        );
      case "GROUP_INVITE":
        return (
          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white"
            >
              View Invite
            </button>
          </div>
        );
      case "MESSAGE":
        return (
          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white"
            >
              View Message
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">

      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 text-gray-700 cursor-pointer" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Full notifications from your account</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {loading && <p className="text-center text-sm text-gray-500">Loading notifications...</p>}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <p className="text-base font-bold text-gray-800">No new notifications</p>
            <p className="text-sm text-gray-500 mt-2">You are all caught up.</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-4 mt-2">
            {notifications.map((notification: any) => (
              <div key={notification.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{notification.message}</p>
                    <p className="text-[11px] text-gray-500">{notification.user?.email ?? "No email available"}</p>
                  </div>
                  <span className="text-[11px] uppercase text-blue-600 font-semibold">{notification.type.replace("_", " ")}</span>
                </div>

                <p className="mt-3 text-sm text-gray-600">{notification.details ?? "Tap an action below to respond."}</p>

                {renderActions(notification)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;

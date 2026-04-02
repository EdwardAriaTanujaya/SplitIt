import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, UserRound } from "lucide-react";
import useFriendStore from "../../store/FriendStore";
import useUserAuth from "../../store/UserAuthStore";

function Header(){
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const { notifications, fetchNotifications } = useFriendStore();

    useEffect(() => {
      if (user?.id) {
        fetchNotifications(user.id);
      }
    }, [user?.id, fetchNotifications]);

    const notificationCount = notifications?.length ?? 0;

    return(
        <div className="flex flex-row w-full h-auto justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="Logo"
            className="h-8 antialiased"
          />
        </div>
        <div className="flex flex-row gap-2">
          <button
              onClick={() => navigate('/notification')}
              className="relative h-[31px] w-[31px] bg-[var(--color-gray)] flex justify-center items-center rounded-full cursor-pointer">
            <Bell className="text-black w-4 h-4" strokeWidth={2.5}/>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {notificationCount}
              </span>
            )}
          </button>
          <Link to="/profile" className="w-[31px] h-[31px] bg-[var(--color-gray)] rounded-full flex justify-center items-center cursor-pointer">
            <UserRound className="text-black w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    )
}

export default Header;
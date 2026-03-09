import { Bell, UserRound } from "lucide-react";
import useUserAuth from "../../store/UserAuthStore";

function Header(){
    const user = useUserAuth((s) => s.user);
    
    return(
        <div className="flex flex-row w-full h-auto justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="Logo"
            className="h-8 antialiased"
          />
          {user && (
            <span className="text-sm font-bold text-gray-700 ml-2">
              Hi, {user.name}
            </span>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <div className="h-[31px] w-[31px] bg-[var(--color-gray)] flex justify-center items-center rounded-full">
            <Bell className="text-black w-4 h-4" strokeWidth={2.5}/>
          </div>
          <div className="w-[31px] h-[31px] bg-[var(--color-gray)] rounded-full flex justify-center items-center">
            <UserRound className="text-black w-4 h-4" strokeWidth={2.5}></UserRound>
          </div>
        </div>
      </div>
    )
}

export default Header;
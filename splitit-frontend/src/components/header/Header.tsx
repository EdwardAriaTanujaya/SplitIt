import { Bell, UserRound } from "lucide-react";

function Header(){
    return(
        <div className="flex flex-row w-screen h-auto content-between">
        <div className="flex-2">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mt-[15px] ml-[14px] antialiased"
          />
        </div>
        <div className="flex flex-row flex mt-[15px] mr-[15px] h-auto">
          <div className="h-[31px] w-[31px] bg-[var(--color-gray)] mr-2 flex justify-center items-center rounded-4xl">
            <Bell className="text-black" strokeWidth={2.5}/>
          </div>
          <div className="w-[31px] h-[31px] bg-[var(--color-gray)] rounded-4xl flex justify-center items-center">
            <UserRound className="text-black" strokeWidth={2.5}></UserRound>
          </div>
        </div>
      </div>
    )
}

export default Header;
import { UserRound, UsersRound} from "lucide-react";
import { useState } from "react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import HeaderTagline from "../components/header/HeaderTagline";
import FloatingButton from "../components/button/FloatingButton";
import Header from "../components/header/Header";

function ExpenseMain() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="h-screen w-screen bg-white">
      <Header />

      <HeaderTagline
        title="Your Groups"
        subtitle="Manage your groups and expenses"
        onChange={setSearch}
        value={search}
        placeholder="Search groups"
        />

      {/* <div className="rounded-2xl shadow-lg bg-white w-[90%] max-w-[400px] h-[104px] ml-[14px] mt-[20px]">
        <div className="flex flex-col mt-5 ml-5 w-full h-auto">
          <div className="flex flex-row">
            <div className="flex-1">
              <div className="w-[43px] h-[43px] shadow-lg overflow-hidden bg-white rounded-full border border-[var(--color-gray)]">
              <img
                src="/KFCLogo.jpg"
                alt="KFC Logo"
                className="w-full h-full"
              />
              </div>
            </div>
            <div className="flex justify-end items-center mr-7">
              <ChevronRight className="w-6 h-6 text-[var(--color-lightgray)]" />
            </div>
          </div>
          <p className="text-base font-bold">KFC Party</p>
          <p className="text-xs text-[var(--color-lightgray)]">12 members</p>
        </div>
      </div> */}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <img
          src="/GroupLogo.png"
          alt="Group Logo"
          className="w-35 h-35 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain"
        />
        <p className="text-base sm:text-lg md:text-xl text-center text-black font-bold">
          You don't have any groups yet.
        </p>
        <p className="text-sm text-[var(--color-lightgray)]">Join or create one to get started</p>
      </div>
     
      <FloatingButton/>

      <div className="fixed bottom-0 left-0 right-0 bg-white h-15 w-screen border-t-3 border-[var(--color-gray)] flex flex-row">
        <a className="flex flex-col flex-1 items-center justify-center" href="/expense">
          <BanknotesIcon className="w-[24px] h-[24px] text-[var(--fun-color-primary)]" />
          <p className="text-xs text-[var(--fun-color-primary)] font-bold">Expenses</p>
        </a>
        <a className="flex flex-col flex-1 items-center justify-center" href="/friends">
          <UsersRound className="w-6 h-6 text-[var(--fun-color-lightgray)]" />
          <p className="text-xs text-[var(--fun-color-lightgray)] font-bold">Friends</p>
        </a>
        <a className="flex flex-col flex-1 items-center justify-center" href="/profile">
          <UserRound className="w-6 h-6 text-[var(--fun-color-lightgray)]" />
          <p className="text-xs text-[var(--fun-color-lightgray)] font-bold">Profile</p>
        </a>  
      </div>

    </div>
  );
}

export default ExpenseMain;

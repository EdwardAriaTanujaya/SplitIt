import { UserRound, UsersRound} from "lucide-react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import HeaderTagline from "../components/header/HeaderTagline";
import FloatingButton from "../components/button/FloatingButton";
import { useState } from "react";
import Header from "../components/header/Header";

function FriendMain() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="h-screen w-screen bg-white">
        <Header />

        <HeaderTagline 
          title="Your Friends"
          subtitle="Manage your friends and remind them"
          onChange={setSearch}
          value={search}
          placeholder="Search friends"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <img
          src="/FriendLogo.png"
          alt="Friend Logo"
          className="w-35 h-35 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain"
        />
        <p className="text-base sm:text-lg md:text-xl text-center text-black font-bold">
          You don't have any friends yet.
        </p>
        <p className="text-sm text-[var(--color-lightgray)]">Add friends to get started</p>
      </div>

      <FloatingButton />

      <div className="fixed bottom-0 left-0 right-0 bg-white h-15 w-screen border-t-3 border-[var(--color-gray)] flex flex-row">
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/expense"
        >
          <BanknotesIcon className="w-[24px] h-[24px] text-[var(--fun-color-lightgray)]" />
          <p className="text-xs text-[var(--fun-color-lightgray)] font-bold">
            Expenses
          </p>
        </a>
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/friends"
        >
          <UsersRound className="w-6 h-6 text-[var(--fun-color-primary)]" />
          <p className="text-xs text-[var(--fun-color-primary)] font-bold">
            Friends
          </p>
        </a>
        <a
          className="flex flex-col flex-1 items-center justify-center"
          href="/profile"
        >
          <UserRound className="w-6 h-6 text-[var(--fun-color-lightgray)]" />
          <p className="text-xs text-[var(--fun-color-lightgray)] font-bold">
            Profile
          </p>
        </a>
      </div>
    </div>
  );
}

export default FriendMain;

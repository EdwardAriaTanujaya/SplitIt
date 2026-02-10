import { Plus } from "lucide-react";

function FloatingButton() {
    return (
        <div className="fixed bottom-20 right-4 flex flex-row">
        <button className="bg-[var(--color-primary)] rounded-4xl w-[45px] h-[45px] flex justify-center items-center cursor-pointer active:shadow-inner transition-all duration-100 brightness-100 active:brightness-90">
          <Plus className="text-white w-[31px] h-[31px]"></Plus>
        </button>
      </div>
    )
}

export default FloatingButton;
import { Search } from "lucide-react";

interface HeaderTaglineProps {
  title: string;
  subtitle: string;
  onChange: (val: string) => void;
  value: string;
  placeholder?: string;
}

function HeaderTagline({ title, subtitle, onChange, value, placeholder }: HeaderTaglineProps) {
  return (
    <div className="flex flex-col mt-[22px] ml-[14px]">
      <p className="font-bold text-base">{title}</p>
      <p className="font-normal text-sm text-[var(--color-lightgray)]">
        {subtitle}
      </p>
      <div className="h-auto mt-3 mr-4">
        <div className="relative flex">
          
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            placeholder={placeholder || ""}
            className="w-full h-8 rounded-lg px-3 py-2 focus:outline-none bg-white drop-shadow-sm pr-7 z-10"
          />

          <div className="absolute inset-y-0 right-2 flex items-center pl-3 cursor-pointer z-10">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeaderTagline;

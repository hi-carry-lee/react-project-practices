import { Check, Copy } from "lucide-react";
import { useState } from "react";

function ColorBlock({ color }: { color: string }) {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handleCopy = () => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 2000);
    navigator.clipboard.writeText(color);
  };

  return (
    // recommend using inline style, it hasn't tailwind compilation issue; inline style can use any type of value for color;
    <div
      className="shadow-lg hover:-translate-y-2 duration-200 rounded-xl overflow-hidden cursor-pointer"
      onClick={handleCopy}
    >
      <div
        style={{ backgroundColor: color }}
        // className="min-h-32 min-w-12 rounded-xl"
        // 这里不使用 rounded-xl，而是在父元素使用overflow-hidden
        className="min-h-32 min-w-12"
      ></div>
      <div className="text-center px-4 py-3 flex justify-between items-center">
        <span className="uppercase text-sm font-medium">{color}</span>{" "}
        {isPressed ? (
          <Check className="text-green-600" size={18} />
        ) : (
          <Copy size={16} />
        )}
      </div>
    </div>
  );
}

export default ColorBlock;

import { RefreshCw } from "lucide-react";
import ColorBlock from "./color-block";
import { useState } from "react";

const hexDigits = "0123456789ABCDEF".split("");

const generateRandomColor = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexDigits[Math.floor(Math.random() * hexDigits.length)];
  }
  return color;
};

function ColorPalette() {
  const [colors, setColors] = useState<string[]>([
    "#e1f5fe",
    "#b3e5fc",
    "#81d4fa",
    "#4fc3f7",
    "#29b6f6",
  ]);

  /*
  !1.不能直接修改了 state
  const handleGenerateColors = () => {
    console.log("handleGenerateColors");
    setColors([]);
    for (let i = 0; i < 5; i++) {
      colors.push(generateRandomColoe());
    }
    setColors(colors);
    console.log({ colors });
  };
  */

  const handleGenerate = () => {
    // Array.from({ length: 5 }) 会生成一个长度为 5 的新数组
    // 第二个参数是一个 回调函数，会被自动执行 5 次，每次的返回值会作为新数组的对应元素
    const newColors = Array.from({ length: 5 }, () => generateRandomColor());
    setColors(newColors);
  };

  return (
    // background
    <div className="h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 flex justify-center items-center">
      {/* container */}
      <div className="max-w-[800px] w-full bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <h1 className="text-center text-3xl font-bold mt-2 my-8 relative after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-3/7 after:h-[3px] after:bg-[#667eea] after:rounded-[2px]">
          Color Palette Generator
        </h1>
        <div className="mt-10">
          <button
            className="flex gap-2 items-center text-white text-lg px-6 py-3 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 duration-150 cursor-pointer rounded-full bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-500"
            onClick={handleGenerate}
          >
            <RefreshCw size={18} strokeWidth={2.5} />
            Generate Palette
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-8">
          {colors.map((color, idx) => (
            <ColorBlock color={color} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPalette;

/*
1. for container, if only max-w-[800px], it will collapse when no content, so we need to add 'w-full'
  1.1 max-w-[800px] is just a constraint, it doesn't mean to set up a value for the width;
  1.2 w-full means that the width of current element is one hundred percent of its parent, combine with max-w-[800px], it can make the current element keep a width of 800px, it also has the max width property;

2. 

*/

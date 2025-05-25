const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex gap-4">
      <label
        // 用label去包裹input，这样点击span文字，也能触发input；
        className="label gap-2 cursor-pointer"
      >
        <span className="label-text text-gray-300">Male</span>
        <input
          type="checkbox"
          className="checkbox border-slate-500"
          // 用来控制两个checkbox只有一个能被选中
          checked={selectedGender === "male"}
          onChange={() => onCheckboxChange("male")}
        />
      </label>

      <label className="label gap-2 cursor-pointer">
        <span className="label-text text-gray-300">Female</span>
        <input
          type="checkbox"
          className="checkbox border-slate-700"
          // 用来控制两个checkbox只有一个能被选中
          checked={selectedGender === "female"}
          onChange={() => onCheckboxChange("female")}
        />
      </label>
    </div>
  );
};
export default GenderCheckbox;

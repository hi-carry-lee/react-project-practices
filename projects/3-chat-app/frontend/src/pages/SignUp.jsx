import { Link } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";
import { useState } from "react";
import useSignup from "../hooks/useSignup";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    // <div className="flex flex-col gap-4 min-w-96 mx-auto ">
    //   <div className="p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 space-y-4">
    // only one element in the container, so flex flex-col gap-4 is not needed
    // bg-opacity-0 and bg-gray-400 is reduntant
    <div className="min-w-96 mx-auto p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg space-y-4">
      {/* Title */}

      <h1 className="text-3xl font-bold text-center text-gray-300">
        Sign Up <span className="text-blue-500">ChatApp</span>
      </h1>

      {/* form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label
            // daisy ui的label让label元素变成了块元素，label和input就变成了两行，再通过给input添加w-full，让它占满整个宽度
            className="label p-2"
          >
            <span className="text-base label-text">Full Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            // w-full让input占满整个宽度
            // input input-bordered 是daisy ui的样式
            className="w-full input input-bordered h-10"
            value={inputs.fullName}
            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="label p-2">
            <span className="text-base label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full input input-bordered h-10"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />
        </div>
        <div>
          <label className="label p-2">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            className="w-full input input-bordered h-10"
            type="password"
            placeholder="Enter Password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />
        </div>
        <div>
          <label className="label p-2">
            <span className="text-base label-text">Confirm Password</span>
          </label>
          <input
            className="w-full input input-bordered h-10"
            type="password"
            placeholder="Enter Confirm Password"
            value={inputs.confirmPassword}
            onChange={(e) =>
              setInputs({ ...inputs, confirmPassword: e.target.value })
            }
          />
        </div>

        <GenderCheckbox
          onCheckboxChange={handleCheckboxChange}
          selectedGender={inputs.gender}
        />
        <Link
          to="/login"
          className="text-sm  hover:underline text-gray-300 hover:text-blue-600 mt-2 inline-block tracking-wide"
        >
          Already have an account?
        </Link>
        <div>
          <button
            className="btn btn-block btn-sm mt-2 border border-slate-700"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
    </div>
    // </div>
  );
};

export default SignUp;

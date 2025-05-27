import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { authUser, handleSetAuthUser } = useAuthContext();
  const [formData, setFormData] = useState({
    fullName: authUser.fullName,
  });

  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      // use toast to show the response
      const data = await res.json();
      toast.success(data.message);
      handleSetAuthUser({ ...authUser, fullName: formData.fullName });
    } catch (error) {
      console.log("Error in updateProfile", error.message);
    }
  }
  return (
    <div className="bg-purple-200 w-96 p-4 backdrop-filter backdrop-blur-lg bg-opacity-20 rounded-lg">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-center text-white text-3xl">User Profile</h1>
        <div className="rounded-full overflow-hidden w-12 h-12">
          <img src={authUser.profilePic} alt="avatar" />
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4 w-full">
          <div>
            <input
              type="text"
              placeholder="fullname"
              value={formData.fullName}
              className="input w-full"
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <button className="btn btn-primary w-full">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

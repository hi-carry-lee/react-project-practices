import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // this function is used to handle on change event of the input
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // FileReader是浏览器提供的原生JavaScript API，专门用于异步读取用户计算机上的文件内容
    const reader = new FileReader();

    // 这个函数实现：读取文件，并将文件的数据表示为 base64 编码字符串
    reader.readAsDataURL(file);

    // onload是FileReader的一个事件，当读取文件成功时，会触发 onload 事件，
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      const res = await updateProfile({ avatar: base64Image });
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                // The order here is intentional. We put selectedImg first because whenever a user selects a new image,
                // we want to display that new image instead of their existing avatar.
                src={selectedImg || authUser.avatar || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              {/* why use label to wrap input? we have a explanation in the bottom */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;

/*
This design pattern (hiding the actual input and using a label as a replacement) solves the following issues:

1. Styling Challenges with Native File Inputs
   - Default file input controls have inconsistent appearances across different browsers
   - Native control styles are nearly impossible to fully customize with CSS alone
2. Provides Completely Custom Visual Experience
   - Allows using any element (such as icons) as an upload trigger
   - Offers complete control over the upload button's position, size, and appearance
3. Preserves Native Functionality
   - Maintains accessibility (clicking the label still activates the input)
   - Preserves the native behavior of the file selection dialog
   - Requires no complex JavaScript to implement file selection

4. How It Works
The workflow of this code is:
   - The actual <input type="file"> is set to hidden, invisible to users
   - The <label> is styled as a circular button, positioned at the bottom-right of the avatar
   - The <Camera> icon visually indicates this is a button for uploading an avatar
   - When users click the label (including the Camera icon), it automatically triggers the click event of the hidden input
   - The browser opens the file selection dialog, just as if the original file input was clicked
After selecting a file, the onChange event fires, executing the handleImageUpload function

5. Use Cases
This pattern is particularly common in the following scenarios:
   - Avatar uploads (as in this example)
   - Beautified file upload buttons
   - Drag and drop upload areas
   - Custom multimedia selectors

*/

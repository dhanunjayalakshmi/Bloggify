import EditProfileForm from "@/components/user/profile/EditProfileForm";
import { MOCKUSERDATA } from "@/utils/mockUserProfileJson";

const EditProfilePage = () => {
  const user = MOCKUSERDATA;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>
      <EditProfileForm initialData={user} />
    </div>
  );
};

export default EditProfilePage;

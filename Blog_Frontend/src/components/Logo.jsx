import { useNavigate } from "react-router";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-lg">
        B
      </div>
      <span className="text-2xl font-bold text-orange-500 ">Bloggify</span>
    </div>
  );
};

export default Logo;

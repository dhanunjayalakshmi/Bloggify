import { NavLink, Outlet } from "react-router";

const tabs = [
  { name: "Profile", path: "/account" },
  { name: "Dashboard", path: "/account/dashboard" },
  { name: "Stats & Activity", path: "/account/stats" },
  { name: "Posts", path: "/account/posts" },
  { name: "Bookmarks", path: "/account/bookmarks" },
  { name: "Settings", path: "/account/settings" },
];

const UserAccountLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-800 mt-8">
      <aside className="w-64 p-4 border-r dark:border-gray-700">
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "hover:bg-orange-600/20 dark:hover:bg-orange-600/30 text-black dark:text-white"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserAccountLayout;

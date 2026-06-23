import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const tabs = [
  { name: "Profile", path: "/profile" },
  { name: "Posts", path: "/profile/posts" },
  { name: "Bookmarks", path: "/profile/bookmarks" },
  { name: "Stats & Activity", path: "/profile/stats" },
  { name: "Series", path: "/profile/series" },
  { name: "History", path: "/profile/history" },
  { name: "Settings", path: "/profile/settings" },
];

const UserAccountLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const shouldHighlightProfile =
    location.pathname === "/profile" || location.pathname === "/profile/edit";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-800 my-8 overflow-hidden relative rounded-xl">
      <aside className="hidden md:block w-64 p-4 border-r dark:border-gray-700">
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const isCurrentProfileTab =
              tab.path === "/profile" && shouldHighlightProfile;

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md font-medium transition ${
                    isActive || isCurrentProfileTab
                      ? "bg-orange-600 text-white"
                      : "hover:bg-orange-600/20 dark:hover:bg-orange-600/30 text-black dark:text-white"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden absolute top-4 left-4 z-20">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 shadow-md"
            >
              <Menu className="w-5 h-5" />
              Menu
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 p-4 dark:bg-gray-800 bg-gray-100"
          >
            <SheetHeader>
              <SheetTitle className="text-lg">Account</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-2 mt-4">
              {tabs.map((tab) => {
                const isCurrentProfileTab =
                  tab.path === "/profile" && shouldHighlightProfile;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    end
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-md font-medium transition ${
                        isActive || isCurrentProfileTab
                          ? "bg-orange-600 text-white"
                          : "hover:bg-orange-600/20 dark:hover:bg-orange-600/30 text-black dark:text-white"
                      }`
                    }
                  >
                    {tab.name}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserAccountLayout;

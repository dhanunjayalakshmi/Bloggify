import { NavLink, Outlet, useLocation } from "react-router";
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
  { name: "Profile", path: "/account" },
  { name: "Dashboard", path: "/account/dashboard" },
  { name: "Stats & Activity", path: "/account/stats" },
  { name: "Posts", path: "/account/posts" },
  { name: "Bookmarks", path: "/account/bookmarks" },
  { name: "Settings", path: "/account/settings" },
];

const UserAccountLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the sidebar automatically on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-800 mt-8 overflow-hidden relative">
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 p-4 border-r dark:border-gray-700">
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

      {/* Mobile Menu Button */}
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserAccountLayout;

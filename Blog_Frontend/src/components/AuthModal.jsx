import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import { useModalStore } from "@/stores/modalStore";

export default function AuthModal() {
  const { isOpen, closeModal, mode } = useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md w-full p-0 bg-white dark:bg-gray-900 border dark:border-gray-700">
        <VisuallyHidden>
          <DialogTitle>{mode === "login" ? "Login" : "Sign Up"}</DialogTitle>
        </VisuallyHidden>
        <div className="p-4">{mode === "login" ? <Login /> : <Signup />}</div>
      </DialogContent>
    </Dialog>
  );
}

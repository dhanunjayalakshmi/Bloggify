import { useModalStore } from "@/stores/modalStore";
import { Button } from "../ui/button";

const CTASection = () => {
  const { openModal } = useModalStore();

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-2xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to start writing?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Join thousands of writers sharing their ideas on Bloggify. It's free.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button
            size="lg"
            className="px-8"
            onClick={() => openModal("signup")}
          >
            Create your account
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => openModal("login")}
          >
            Browse first
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

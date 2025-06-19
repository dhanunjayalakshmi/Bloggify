const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Logo or Copyright */}
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} MediumClone. All rights reserved.
        </div>

        {/* Right: Links */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          <a
            href="/about"
            className="hover:underline hover:text-primary transition"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:underline hover:text-primary transition"
          >
            Contact
          </a>
          <a
            href="/terms"
            className="hover:underline hover:text-primary transition"
          >
            Terms
          </a>
          <a
            href="https://github.com/your-github-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-primary transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

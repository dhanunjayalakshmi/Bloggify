import React from "react";

const ContactPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 ">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="text-lg leading-relaxed">
        Have feedback or questions? We’d love to hear from you.
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2 text-lg">
        <li>
          Email:{" "}
          <a
            href="mailto:yourname@example.com"
            className="underline text-primary"
          >
            yourname@example.com
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            github.com/yourusername
          </a>
        </li>
        <li>
          Twitter:{" "}
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            @yourhandle
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactPage;

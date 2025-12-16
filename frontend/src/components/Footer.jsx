import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 font-fredoka mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-slate-800 text-lg font-gloria mr-2">
            FurEver
          </span>
          &copy; 2025. All rights reserved.
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center md:text-right text-xs text-slate-400">
          <a href="https://storyset.com/" className="hover:text-slate-600">
            Illustrations by Storyset
          </a>
          <a
            href="https://www.vecteezy.com/free-png/dog-peeking"
            className="hover:text-slate-600"
          >
            Dog Graphics by Vecteezy
          </a>
          <a
            href="https://www.vecteezy.com/free-png/cat-peeking"
            className="hover:text-slate-600"
          >
            Cat Graphics by Vecteezy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

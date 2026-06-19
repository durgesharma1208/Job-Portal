import { Heart, Link, Code2, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-t border-white/10 text-gray-300 py-12 ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-3">
              JobSearch
            </h3>
            <p className="text-gray-400 text-sm">
              Your gateway to premium job opportunities
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/home"
                  className="hover:text-green-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  className="hover:text-green-400 transition-colors"
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/saved-jobs"
                  className="hover:text-green-400 transition-colors"
                >
                  Saved Jobs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Career Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-green-400 transition-colors">
                <Link size={20} />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Code2 size={20} />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 MyApp. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              Made with <Heart size={16} className="text-red-500" /> for job
              seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

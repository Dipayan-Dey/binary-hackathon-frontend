import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './Logo';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
                <Logo/>
             
              {/* <span className="text-xl font-bold text-white">
                Readynx
              </span> */}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered career readiness platform helping students and developers bridge the gap between education and industry through data-driven insights.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Features</a></li>
              <li><a href="#workflow" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">How It Works</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Benefits</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Readynx.  All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-blue-600">
              <Github size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-blue-600">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-blue-600">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

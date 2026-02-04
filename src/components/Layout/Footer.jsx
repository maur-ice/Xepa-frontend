import React from "react";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {currentYear} Xepa Manager. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/help" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Help Center
              </a>
              <a 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact Us
              </a>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-600 flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by Streams Technologies
                <p>MAURICE GALEN</p>
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-gray-500">
              Version 1.0 • Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { useSocialLinks, sanitizeUrl } from '../utils/socialLinks';

const Footer = () => {
  const { activeLinks } = useSocialLinks();

  return (
    <footer className="bg-darker py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <a href="/" className="text-2xl font-bold gradient-text">Portfolio</a>
            <p className="text-slate-400 mt-2">© 2023 Abdurehman Seid. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={sanitizeUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                title={link.platform}
                className="text-slate-400 hover:text-primary transition-all duration-300"
              >
                <i className={`${link.icon} text-2xl`}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          <p>Made with <i className="fas fa-heart text-red-500 pulse-animation"></i> and lots of <i className="fas fa-coffee text-amber-500"></i></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

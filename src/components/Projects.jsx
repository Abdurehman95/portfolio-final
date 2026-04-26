import React, { useState } from 'react';
import ProjectBorderThree from './ProjectBorderThree';


const ProjectCard = ({ project, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Slightly more subtle tilt for the original layout
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative perspective-1000 p-[2px] rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: isHovered ? 20 : 1,
      }}
    >
      {/* Restore Three.js Border Layer */}
      <ProjectBorderThree isHovered={isHovered} />

      <div
        className={`project-card rounded-2xl overflow-hidden relative z-10 bg-slate-900/80 backdrop-blur-md h-full flex flex-col border border-white/5 transition-all duration-200 ease-out`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="h-52 overflow-hidden relative group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-3">{project.title}</h3>
          <p className="text-slate-400 mb-4 text-sm flex-grow">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-4 pt-4 border-t border-white/5">
            <a
              href={project.liveUrl}
              className="text-primary hover:text-secondary transition flex items-center gap-2 text-sm font-medium"
            >
              <i className="fas fa-external-link-alt text-xs"></i> Live
            </a>
            <a
              href={project.codeUrl}
              className="text-primary hover:text-secondary transition flex items-center gap-2 text-sm font-medium"
            >
              <i className="fab fa-github text-xs"></i> Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};



const Projects = () => {
  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform built with React, Node.js, and MongoDB.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1470&q=80',
      tags: ['React', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      codeUrl: '#'
    },
    {
      title: 'Tourism managment system',
      description: 'A productivity app for managing tourism and developing nation.',
      image: '/tms.png',
      tags: ['React', 'php', 'TailwindCSS'],
      liveUrl: '#',
      codeUrl: 'https://github.com/Abdurehman95/TOURISM-MANAGEMENT-SYSSTEM-UPDATED'
    },
    {
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media metrics with real-time updates.',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1470&q=80',
      tags: ['Next.js', 'Chart.js', 'TypeScript'],
      liveUrl: '#',
      codeUrl: '#'
    },
    {
      title: 'Weather Application',
      description: 'Real-time weather forecasting app with location detection.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1469&q=80',
      tags: ['JavaScript', 'API', 'CSS3'],
      liveUrl: '#',
      codeUrl: '#'
    },
    {
      title: 'Portfolio Website',
      description: 'A responsive portfolio website built with modern design principles.',
      image: '/portfolio.png',
      tags: ['CSS3', 'react'],
      liveUrl: 'https://abdurex.vercel.app/',
      codeUrl: 'https://github.com/Abdurehman95/react-portfolio-final'
    },
    {
      title: 'Team Collaboration App',
      description: 'Real-time collaboration tool for remote teams with chat functionality.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1470&q=80',
      tags: ['React', 'Socket.io', 'MongoDB'],
      liveUrl: '#',
      codeUrl: '#'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-darker overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            My <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        <div className="text-center mt-12 fade-in-up">
          <a href="#" className="px-8 py-4 rounded-full btn-primary font-medium inline-flex items-center gap-3">
            View All Projects <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;

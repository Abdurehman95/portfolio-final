import React, { useState, useEffect } from 'react';
import ProjectBorderThree from './ProjectBorderThree';
import { supabase } from '../supabaseClient';

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

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const tags = Array.isArray(project.tags)
    ? project.tags
    : (typeof project.technologies === 'string'
      ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : []);
  const liveUrl = project.live_url || project.liveUrl || '#';
  const codeUrl = project.github_url || project.codeUrl || '#';
  const imageSrc = project.image || '/portfolio.png';

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
      {/* Three.js Border Layer */}
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
            src={imageSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-3">{project.title}</h3>
          <p className="text-slate-400 mb-4 text-sm flex-grow">{project.description}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex space-x-4 pt-4 border-t border-white/5">
            <a
              href={liveUrl}
              target={liveUrl !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition flex items-center gap-2 text-sm font-medium"
            >
              <i className="fas fa-external-link-alt text-xs"></i> Live
            </a>
            <a
              href={codeUrl}
              target={codeUrl !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
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

const defaultProjects = [
  {
    title: 'Tourism managment system',
    description: 'A productivity app for managing tourism and developing nation.',
    image: '/tms.png',
    tags: ['React', 'php', 'TailwindCSS'],
    liveUrl: '#',
    codeUrl: 'https://github.com/Abdurehman95/TOURISM-MANAGEMENT-SYSSTEM-UPDATED'
  },
  {
    title: 'Efoy Hotel and Suites',
    description: 'A comprehensive hotel management system designed for Efoy Hotel and Suites to streamline room bookings, luxury dining, and guest services.',
    image: '/hotel-p.png',
    tags: ['React', 'Express', 'PostgreSQL'],
    liveUrl: '#',
    codeUrl: 'https://github.com/Abdurehman95/Efoy-hotel.git'
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
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with React, Node.js, and MongoDB.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1470&q=80',
    tags: ['React', 'Node.js', 'MongoDB'],
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
    title: 'Team Collaboration App',
    description: 'Real-time collaboration tool for remote teams with chat functionality.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1470&q=80',
    tags: ['React', 'Socket.io', 'MongoDB'],
    liveUrl: '#',
    codeUrl: '#'
  }
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        setProjects(defaultProjects);
      } else if (data) {
        // Show published projects (or any with status Published / empty status)
        const published = data.filter(p => !p.status || p.status === 'Published');
        setProjects(published);
      }
    } catch (err) {
      console.error('Failed to load projects from Supabase:', err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Realtime listener for immediate project updates when edited/deleted in admin
    const channel = supabase
      .channel('public_projects_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="projects" className="py-20 bg-darker overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            My <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No published projects found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} index={index} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 fade-in-up">
          <a
            href="https://github.com/Abdurehman95"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full btn-primary font-medium inline-flex items-center gap-3"
          >
            View All Projects <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;


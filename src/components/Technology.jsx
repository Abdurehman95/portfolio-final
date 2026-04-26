import React, { useState, useEffect, useRef } from 'react';

const Technology = () => {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef(null);

  const technicalSkills = [
    { name: 'HTML/CSS', level: 95 },
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 }
  ];

  const professionalSkills = [
    { name: 'Communication', level: 90 },
    { name: 'Teamwork', level: 85 },
    { name: 'Problem Solving', level: 95 },
    { name: 'Creativity', level: 75 }
  ];

  const tools = [
    { icon: 'fab fa-html5', name: 'HTML5', color: 'text-orange-500' },
    { icon: 'fab fa-css3-alt', name: 'CSS3', color: 'text-blue-500' },
    { icon: 'fab fa-js', name: 'JavaScript', color: 'text-yellow-400' },
    { icon: 'fab fa-react', name: 'React', color: 'text-blue-400' },
    { icon: 'fab fa-node-js', name: 'Node.js', color: 'text-green-500' },
    { icon: 'fas fa-database', name: 'PostgreSQL', color: 'text-blue-400' },
    { icon: 'fab fa-git-alt', name: 'Git', color: 'text-orange-600' },
    { icon: 'fab fa-npm', name: 'npm', color: 'text-red-500' },
    { icon: 'fab fa-microsoft', name: '.NET', color: 'text-indigo-600' },
    { icon: 'fab fa-figma', name: 'Figma', color: 'text-purple-500' },
    { icon: 'fas fa-terminal', name: 'VS Code', color: 'text-gray-300' },
    { icon: 'fab fa-docker', name: 'Docker', color: 'text-blue-500' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animated]);

  return (
    <section id="technology" className="py-20 bg-darker min-h-screen" ref={sectionRef}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            My <span className="gradient-text">Technology</span> & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative mb-24">
          {/* Technical Skills - Neon Bars */}
          <div className="fade-in-left relative pl-6">
            <h3 className="text-2xl font-bold mb-10">Technical Mastery</h3>
            <div className="space-y-10">
              {technicalSkills.map((skill, index) => (
                <div key={index} className="skill-item relative">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-lg">{skill.name}</span>
                    <span className="font-bold gradient-text">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-neon-container">
                    <div
                      className="skill-bar-neon-progress"
                      style={{ width: animated ? `${skill.level}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Skills - Circular Progress */}
          <div className="fade-in-right">
            <h3 className="text-2xl font-bold mb-10 text-center">Professional Capabilities</h3>
            <div className="grid grid-cols-2 gap-8 justify-items-center">
              {professionalSkills.map((skill, index) => {
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (skill.level / 100) * circumference;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="circular-progress-container mb-4">
                      <svg className="circular-progress-svg">
                        <circle
                          className="circular-progress-circle-bg"
                          cx="50"
                          cy="50"
                          r={radius}
                        />
                        <circle
                          className="circular-progress-circle"
                          cx="50"
                          cy="50"
                          r={radius}
                          stroke="url(#techGradient)"
                          style={{ strokeDashoffset: animated ? offset : circumference }}
                        />
                      </svg>
                      <div className="circular-progress-text">{skill.level}%</div>
                    </div>
                    <span className="font-medium text-lg text-center">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools Section Integrated - Transformed into Infinite Marquee */}
        <div className="mt-24 pt-20 border-t border-white/5">
          <h3 className="text-2xl font-bold mb-12 text-center fade-in-up">
            Development <span className="gradient-text">Toolkit</span>
          </h3>

          {/* Row 1: Right to Left */}
          <div className="toolkit-marquee-container mb-8">
            <div className="toolkit-marquee-track scroll-left">
              {[...tools.slice(0, 6), ...tools.slice(0, 6)].map((tool, index) => (
                <div key={`row1-${index}`} className="tool-card-premium">
                  <i className={`${tool.icon} ${tool.color}`}></i>
                  <span className="font-medium text-slate-300">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="toolkit-marquee-container">
            <div className="toolkit-marquee-track scroll-right">
              {[...tools.slice(6), ...tools.slice(6)].map((tool, index) => (
                <div key={`row2-${index}`} className="tool-card-premium">
                  <i className={`${tool.icon} ${tool.color}`}></i>
                  <span className="font-medium text-slate-300">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;

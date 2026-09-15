import React from 'react';

const Experience = () => {
  const experiences = [
    {
      title: 'Full-Stack Development',
      subtitle: 'Personal & Academic Projects',
      period: '2024 – Present',
      icon: 'fas fa-layer-group',
      points: [
        'Building full-stack web applications using React, Node.js, Express.js, and SQL databases.',
        'Working with MySQL and PostgreSQL for database design and data management.',
        'Developing REST APIs and connecting frontend applications with backend services.'
      ],
      technologies: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'SQL', 'REST APIs']
    },
    {
      title: 'Frontend Development',
      subtitle: 'Web UI & Responsive Applications',
      period: '2023 – 2024',
      icon: 'fas fa-laptop-code',
      points: [
        'Built responsive websites and web applications using HTML, CSS, JavaScript, and React.',
        'Practiced component-based development, responsive design, and modern UI implementation.',
        'Started exploring Next.js for modern React-based applications.'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'TailwindCSS']
    },
    {
      title: 'Software Engineering Student',
      subtitle: 'Debre Berhan University',
      period: '2022 – Present',
      icon: 'fas fa-graduation-cap',
      points: [
        'Developing practical software projects as part of university coursework and personal learning.',
        'Studying software engineering, databases, web development, system design, and software testing.',
        'Continuously improving programming and problem-solving skills through hands-on projects.'
      ],
      technologies: ['Software Engineering', 'Databases', 'System Design', 'Web Development', 'Software Testing']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-dark min-h-[70vh] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            Development <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 fade-in-up stagger-1"></div>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base fade-in-up stagger-2">
            My practical development path and academic progression as a 4th-year Software Engineering student at Debre Berhan University.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {experiences.map((exp, index) => (
            <div key={index} className={`timeline-item stagger-${(index % 6) + 1}`}>
              <div className="timeline-content">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <i className="far fa-calendar-alt text-xs"></i> {exp.period}
                  </span>
                  {exp.subtitle && (
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <i className={exp.icon === 'fas fa-graduation-cap' ? 'fas fa-university text-primary/70' : 'fas fa-code-branch text-primary/70'}></i>
                      {exp.subtitle}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-3 gradient-text flex items-center gap-2">
                  <i className={`${exp.icon} text-primary text-base`}></i>
                  {exp.title}
                </h3>

                <ul className="space-y-2.5 mb-5">
                  {exp.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {exp.technologies.map((tech, tIndex) => (
                    <span
                      key={tIndex}
                      className="px-2.5 py-1 bg-slate-800/80 rounded-md text-xs text-slate-300 border border-white/5 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

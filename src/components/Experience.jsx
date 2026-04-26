import React from 'react';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      period: '2021 - Present',
      description: 'Lead a team of developers to build responsive web applications using React and Next.js. Improved performance by 40% through code optimization.'
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions',
      period: '2019 - 2021',
      description: 'Developed full-stack applications with Node.js, Express, and MongoDB. Implemented RESTful APIs and integrated third-party services.'
    },
    {
      title: 'Junior Web Developer',
      company: 'StartUp Ventures',
      period: '2017 - 2019',
      description: 'Built responsive websites using HTML, CSS, and JavaScript, react, typescript and vue. Collaborated with designers to implement UI/UX improvements.'
    }
  ];

  return (
    <section id="experience" className="py-20 bg-dark min-h-[70vh]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {experiences.map((exp, index) => (
            <div key={index} className={`timeline-item stagger-${(index % 6) + 1}`}>
              <div className="timeline-content">
                <h4 className="text-xl font-bold mb-2 gradient-text">{exp.title}</h4>
                <p className="text-sm text-slate-400 mb-3">{exp.company} • {exp.period}</p>
                <p className="text-slate-300">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

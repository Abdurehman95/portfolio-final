import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'fas fa-code',
      title: 'Web Development',
      description: 'Creating responsive and dynamic websites using modern technologies and frameworks.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Apps',
      description: 'Building cross-platform mobile applications with React Native and Flutter.'
    },
    {
      icon: 'fas fa-paint-brush',
      title: 'UI/UX Design',
      description: 'Designing beautiful and intuitive user interfaces with modern design principles.'
    },
    {
      icon: 'fas fa-server',
      title: 'Backend Development',
      description: 'Developing robust backend systems and APIs with Node.js and databases.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-dark min-h-[60vh]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            My <span className="gradient-text">Services</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="service-card-flip h-64 scale-in" style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="service-card-inner w-full h-full relative cursor-pointer">
                {/* Front Face */}
                <div className="service-card-front absolute inset-0 bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-xl">
                  <div className="text-5xl mb-6 gradient-text">
                    <i className={service.icon}></i>
                  </div>
                  <h4 className="text-xl font-bold">{service.title}</h4>
                </div>

                {/* Back Face */}
                <div className="service-card-back absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 flex flex-col items-center justify-center border border-primary/30 shadow-xl">
                  <h4 className="text-lg font-bold mb-4 text-primary">{service.title}</h4>
                  <p className="text-slate-300 text-center text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

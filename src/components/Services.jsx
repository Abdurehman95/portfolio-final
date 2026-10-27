import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const defaultServices = [
  {
    id: 1,
    icon: 'code',
    title: 'Fullstack Web Development',
    description: 'Building scalable, responsive, and secure web applications using React, Node.js, and modern architectural patterns.',
    tags: ['React', 'Node.js'],
    color: 'primary',
    active: true
  },
  {
    id: 2,
    icon: 'design_services',
    title: 'UI/UX Design',
    description: 'Crafting intuitive and engaging user interfaces with a focus on user experience, accessibility, and modern aesthetics.',
    tags: ['Figma', 'CSS3'],
    color: 'secondary',
    active: true
  },
  {
    id: 3,
    icon: 'api',
    title: 'API Development & Integration',
    description: 'Designing robust RESTful and GraphQL APIs, and seamlessly integrating third-party services for complex web ecosystems.',
    tags: ['REST', 'GraphQL'],
    color: 'tertiary',
    active: true
  }
];

const Services = () => {
  const [services, setServices] = useState(defaultServices);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching services from Supabase:', error);
      } else if (data) {
        const activeServices = data.filter(s => s.active !== false);
        setServices(activeServices);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  useEffect(() => {
    fetchServices();

    const channel = supabase
      .channel('public_services_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const renderIcon = (icon) => {
    if (!icon) {
      return <i className="fas fa-code"></i>;
    }
    if (icon.includes('fa-') || icon.includes('fa ')) {
      return <i className={icon}></i>;
    }
    return <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>{icon}</span>;
  };

  const getTags = (svc) => {
    if (Array.isArray(svc.tags)) return svc.tags;
    if (typeof svc.tags === 'string' && svc.tags.trim()) {
      return svc.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
  };

  return (
    <section id="services" className="py-20 bg-dark min-h-[60vh]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            My <span className="gradient-text">Services</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const tags = getTags(service);

            return (
              <div key={service.id || index} className="service-card-flip h-64 scale-in" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="service-card-inner w-full h-full relative cursor-pointer">
                  {/* Front Face */}
                  <div className="service-card-front absolute inset-0 bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-xl text-center">
                    <div className="text-5xl mb-4 gradient-text flex items-center justify-center">
                      {renderIcon(service.icon)}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                        {tags.map((tag, tIndex) => (
                          <span key={tIndex} className="px-2.5 py-0.5 rounded-full text-xs bg-slate-900/80 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Back Face */}
                  <div className="service-card-back absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 flex flex-col items-center justify-center border border-primary/30 shadow-xl text-center">
                    <h4 className="text-lg font-bold mb-3 text-primary">{service.title}</h4>
                    <p className="text-slate-300 text-center text-sm leading-relaxed mb-3">{service.description}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {tags.map((tag, tIndex) => (
                          <span key={tIndex} className="px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-slate-300 border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

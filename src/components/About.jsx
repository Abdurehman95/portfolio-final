import React, { useState, useEffect } from 'react';
import CodeEditorWithThree from './CodeEditorWithThree';
import ResumeDownload from './ResumeDownload';
import { supabase } from '../supabaseClient';

const defaultAbout = {
  heading: 'Who am I?',
  description: "I'm a passionate Full Stack Developer with over 3 years of experience creating modern web applications. I specialize in JavaScript ecosystems including React, Node.js, and modern CSS frameworks.",
  name: 'Abdurehman seid',
  email: 'abdurehmanseid@gmail.com',
  phone: '+251967192079',
  experience: '3+ Years',
  location: 'Ethiopia, Woldia'
};

const About = () => {
  const [aboutData, setAboutData] = useState(defaultAbout);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase.from('about_content').select('*').single();
        if (data && !error) {
          setAboutData(prev => ({
            ...prev,
            heading: data.heading || prev.heading,
            description: data.description || prev.description,
            experience: data.years_experience ? `${data.years_experience}+ Years` : prev.experience
          }));
        }
      } catch (err) {
        console.warn('Using default about content:', err);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="py-20 bg-darker min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/3 flex justify-center scale-in">
            <CodeEditorWithThree />
          </div>

          <div className="lg:w-2/3">
            <h3 className="text-2xl font-bold mb-6 fade-in-right">{aboutData.heading}</h3>
            <p className="text-slate-400 mb-6 fade-in-right stagger-1 whitespace-pre-line leading-relaxed">
              {aboutData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="fade-in-right stagger-2">
                <h4 className="font-semibold mb-2">Name: <span className="text-slate-300">{aboutData.name}</span></h4>
                <h4 className="font-semibold mb-2">Email: <span className="text-slate-300">{aboutData.email}</span></h4>
                <h4 className="font-semibold mb-2">Phone: <span className="text-slate-300">{aboutData.phone}</span></h4>
              </div>
              <div className="fade-in-right stagger-3">
                <h4 className="font-semibold mb-2">Experience: <span className="text-slate-300">{aboutData.experience}</span></h4>
                <h4 className="font-semibold mb-2">Location: <span className="text-slate-300">{aboutData.location}</span></h4>
              </div>
            </div>

            <div className="flex space-x-4 fade-in-right stagger-4">
              <ResumeDownload />
              <a href="#contact" className="px-6 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/10 transition">Contact Me</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

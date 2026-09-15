import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeDownload = () => {
  const downloadResume = async () => {
    const resumeElement = document.getElementById('resume-content');
    if (!resumeElement) return;

    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a',
        windowWidth: 794, // 210mm at 96 DPI
        windowHeight: 1123, // 297mm at 96 DPI
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Abdurehman_Seid_CV.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const experiences = [
    {
      title: 'Full-Stack Development',
      role: 'Personal & Academic Projects',
      period: '2024 – Present',
      desc: 'Building full-stack web applications using React, Node.js, Express.js, and SQL databases. Designing relational schemas in PostgreSQL and MySQL, and developing REST APIs.'
    },
    {
      title: 'Frontend Development',
      role: 'Web UI & Responsive Applications',
      period: '2023 – 2024',
      desc: 'Built responsive web applications with HTML, CSS, JavaScript, and React. Practiced component-based architecture, responsive design, and explored Next.js for modern applications.'
    },
    {
      title: 'Software Engineering Student',
      role: 'Debre Berhan University',
      period: '2022 – Present',
      desc: '4th-year student developing practical coursework and personal software projects. Studying software engineering, database design, web architecture, and software testing.'
    }
  ];

  const techStack = [
    { name: 'React & Next.js', level: 90 },
    { name: 'JavaScript (ES6+)', level: 88 },
    { name: 'Node.js & Express.js', level: 84 },
    { name: 'PostgreSQL & MySQL', level: 82 },
    { name: 'HTML5 & CSS3', level: 92 },
    { name: 'REST APIs & SQL', level: 85 }
  ];

  const projects = [
    {
      name: 'Efoy Hotel and Suites',
      tech: 'React • Express • PostgreSQL',
      desc: 'Full-stack hotel management system featuring luxury room reservations, guest services, and booking management.'
    },
    {
      name: 'Tourism Management System',
      tech: 'React • PHP • TailwindCSS',
      desc: 'Web platform for managing tourism packages, travel destinations, and administrative reservation workflows.'
    },
    {
      name: 'Portfolio Website',
      tech: 'React • Vanilla CSS',
      desc: 'Personal interactive portfolio with 3D elements, dynamic themes, and showcase of full-stack projects.'
    }
  ];

  const services = [
    'Web Development (React, Next.js)',
    'Backend Development & REST APIs',
    'Mobile Apps (Cross-platform)'
  ];

  const softSkills = ['Problem Solving', 'Teamwork', 'Agile Learning', 'Clean Code', 'Communication', 'Adaptability'];

  return (
    <>
      <button
        onClick={downloadResume}
        className="px-6 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/10 transition flex items-center gap-2"
      >
        <i className="fas fa-download"></i> Download CV
      </button>

      {/* Off-screen CV for capturing */}
      <div
        id="resume-content"
        style={{
          position: 'fixed',
          left: '-5000px',
          top: 0,
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          padding: '36px 40px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '84px', height: '84px', margin: '0 auto 14px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #0ea5e9', boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)' }}>
            <img src="/image.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '26pt', fontWeight: '800', margin: '0', letterSpacing: '1.5px', color: '#ffffff', textTransform: 'uppercase' }}>
            ABDUREHMAN SEID
          </h1>
          <p style={{ fontSize: '11.5pt', color: '#38bdf8', margin: '4px 0 16px', letterSpacing: '1px', fontWeight: '600' }}>
            4th-Year Software Engineering Student • Full-Stack Developer
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '9pt', color: '#94a3b8', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '9px 0' }}>
            <span><i className="fas fa-phone" style={{ color: '#0ea5e9', marginRight: '6px' }}></i> +251 967 1920 79</span>
            <span><i className="fas fa-envelope" style={{ color: '#0ea5e9', marginRight: '6px' }}></i> abdurehmanseid@gmail.com</span>
            <span><i className="fab fa-github" style={{ color: '#0ea5e9', marginRight: '6px' }}></i> github.com/Abdurehman95</span>
            <span><i className="fas fa-map-marker-alt" style={{ color: '#0ea5e9', marginRight: '6px' }}></i> Debre Berhan / Woldia, Ethiopia</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Column (Main content) */}
          <div style={{ flex: '1.45' }}>
            {/* About Me */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px', marginBottom: '10px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Profile Summary
              </h3>
              <p style={{ fontSize: '9.5pt', lineHeight: '1.6', color: '#cbd5e1', textAlign: 'justify', margin: 0 }}>
                Motivated 4th-year Software Engineering student at Debre Berhan University with hands-on experience in full-stack web development. Proficient in React, Node.js, Express.js, PostgreSQL, and MySQL. Passionate about building responsive, practical software applications and continuously expanding technical abilities through real-world projects.
              </p>
            </section>

            {/* Development Experience */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px', marginBottom: '16px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Development Journey
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '18px' }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#0ea5e9', boxShadow: '0 0 6px rgba(14, 165, 233, 0.6)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <h4 style={{ fontSize: '10.5pt', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>{exp.title}</h4>
                      <span style={{ fontSize: '8pt', color: '#38bdf8', fontWeight: '600', backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                        {exp.period}
                      </span>
                    </div>
                    <p style={{ fontSize: '8.5pt', color: '#94a3b8', margin: '0 0 5px', fontWeight: '500' }}>{exp.role}</p>
                    <p style={{ fontSize: '9pt', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Projects */}
            <section>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px', marginBottom: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Featured Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((p, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <h4 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>{p.name}</h4>
                      <span style={{ fontSize: '7.5pt', color: '#38bdf8', fontWeight: '500' }}>{p.tech}</span>
                    </div>
                    <p style={{ fontSize: '8.5pt', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div style={{ flex: '1', borderLeft: '1px solid #1e293b', paddingLeft: '26px' }}>
            {/* Education */}
            <section style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Education
              </h3>
              <div>
                <h4 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0', color: '#ffffff' }}>BSc in Software Engineering</h4>
                <p style={{ fontSize: '8.5pt', color: '#38bdf8', margin: '2px 0', fontWeight: '600' }}>Debre Berhan University</p>
                <p style={{ fontSize: '8pt', color: '#94a3b8', margin: '0 0 4px' }}>2022 – Present (4th Year)</p>
                <p style={{ fontSize: '8pt', color: '#64748b', margin: 0, lineHeight: '1.3' }}>Coursework: Software Engineering, Database Systems, Web Tech, System Design.</p>
              </div>
            </section>

            {/* Tech Stack */}
            <section style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Technical Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {techStack.map((tech, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', marginBottom: '3px', color: '#cbd5e1' }}>
                      <span>{tech.name}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
                      <div style={{ width: `${tech.level}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #a855f7)', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Services */}
            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Core Services
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {services.map((svc, i) => (
                  <div key={i} style={{ fontSize: '8.5pt', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#0ea5e9' }}>•</span> {svc}
                  </div>
                ))}
              </div>
            </section>

            {/* Soft Skills */}
            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Soft Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {softSkills.map((skill, i) => (
                  <span key={i} style={{ fontSize: '7.5pt', padding: '3px 8px', backgroundColor: '#1e293b', borderRadius: '4px', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Languages
              </h3>
              <div style={{ fontSize: '8.5pt', color: '#cbd5e1' }}>
                <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>English</span>
                  <span style={{ color: '#94a3b8', fontSize: '8pt' }}>Professional</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Amharic</span>
                  <span style={{ color: '#94a3b8', fontSize: '8pt' }}>Native</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, textAlign: 'center', fontSize: '7.5pt', color: '#475569' }}>
          Abdurehman Seid • Portfolio & CV • debere berhan university
        </div>
      </div>
    </>
  );
};

export default ResumeDownload;

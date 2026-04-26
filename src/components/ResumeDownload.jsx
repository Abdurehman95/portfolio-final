import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeDownload = () => {
  const downloadResume = async () => {
    const resumeElement = document.getElementById('resume-content');
    if (!resumeElement) return;

    try {
      // Ensure the element is rendered and fonts are loaded
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1f2e',
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
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      period: '2021 - Present',
      desc: 'Lead a team of developers to build responsive web applications using React and Next.js. Improved performance by 40% through code optimization.'
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions',
      period: '2019 - 2021',
      desc: 'Developed full-stack applications with Node.js, Express, and MongoDB. Implemented RESTful APIs and integrated third-party services.'
    },
    {
      title: 'Junior Web Developer',
      company: 'StartUp Ventures',
      period: '2017 - 2019',
      desc: 'Built responsive websites using HTML, CSS, and JavaScript. Collaborated with designers to implement UI/UX improvements.'
    }
  ];

  const techStack = [
    { name: 'JavaScript', level: 90 },
    { name: 'ReactJS', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'MongoDB', level: 75 }
  ];

  const softSkills = ['Leadership', 'Problem Solving', 'Teamwork', 'Communication', 'Agile'];

  const projects = [
    { name: 'E-commerce Platform', desc: 'React, Node.js, MongoDB platform with full dashboard.' },
    { name: 'Task Management App', desc: 'Productivity tool with real-time updates and drag-and-drop.' }
  ];

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
          backgroundColor: '#1a2238',
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          padding: '40px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #0ea5e9' }}>
            <img src="/image.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '32pt', fontWeight: '800', margin: '0', letterSpacing: '2px', color: '#ffffff', textTransform: 'uppercase' }}>ABDUREHMAN SEID</h1>
          <p style={{ fontSize: '14pt', color: '#94a3b8', margin: '5px 0 20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Fullstack Developer</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', fontSize: '10pt', color: '#cbd5e1', borderTop: '1px solid #334155', borderBottom: '1px solid #334155', padding: '10px 0' }}>
            <span><i className="fas fa-phone" style={{ color: '#0ea5e9', marginRight: '8px' }}></i> +251 967 1920 79</span>
            <span><i className="fas fa-envelope" style={{ color: '#0ea5e9', marginRight: '8px' }}></i> abdurehmanseid@gmail.com</span>
            <span><i className="fas fa-globe" style={{ color: '#0ea5e9', marginRight: '8px' }}></i> woldia, ethiopia</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Left Column */}
          <div style={{ flex: '2' }}>
            <section style={{ marginBottom: '35px' }}>
              <h3 style={{ fontSize: '14pt', fontWeight: 'bold', borderLeft: '4px solid #0ea5e9', paddingLeft: '12px', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>About Me</h3>
              <p style={{ fontSize: '10.5pt', lineHeight: '1.6', color: '#94a3b8', textAlign: 'justify' }}>
                Highly motivated Full Stack Developer with 3+ years of experience in building scalable web applications.
                Specialized in React, Node.js, and modern CSS frameworks. Passionate about creating seamless user
                experiences and solving complex technical challenges with clean, maintainable code.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '14pt', fontWeight: 'bold', borderLeft: '4px solid #0ea5e9', paddingLeft: '12px', marginBottom: '20px', color: '#ffffff', textTransform: 'uppercase' }}>Work Experience</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '20px' }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '9pt', color: '#64748b' }}>{exp.period}</span>
                      <span style={{ fontSize: '9pt', fontWeight: 'bold', color: '#0ea5e9' }}>{exp.company}</span>
                    </div>
                    <h4 style={{ fontSize: '12pt', fontWeight: 'bold', margin: '0 0 8px', color: '#ffffff' }}>{exp.title}</h4>
                    <p style={{ fontSize: '10pt', lineHeight: '1.5', color: '#94a3b8', margin: 0 }}>{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div style={{ flex: '1', borderLeft: '1px solid #334155', paddingLeft: '30px' }}>
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>Tech Stack</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {techStack.map((tech, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9pt', marginBottom: '4px' }}>
                      <span>{tech.name}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#334155', borderRadius: '2px' }}>
                      <div style={{ width: `${tech.level}%`, height: '100%', backgroundColor: '#0ea5e9', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>Soft Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {softSkills.map((skill, i) => (
                  <span key={i} style={{ fontSize: '8pt', padding: '4px 10px', backgroundColor: '#334155', borderRadius: '4px', color: '#cbd5e1' }}>{skill}</span>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {projects.map((p, i) => (
                  <div key={i}>
                    <h4 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0 0 4px', color: '#0ea5e9' }}>{p.name}</h4>
                    <p style={{ fontSize: '8.5pt', color: '#94a3b8', margin: 0 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>Education</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#ffffff' }}>MSc in Computer Science</h4>
                  <p style={{ fontSize: '8.5pt', color: '#94a3b8', margin: '2px 0' }}>Woldia University</p>
                  <p style={{ fontSize: '8pt', color: '#64748b', margin: 0 }}>2018 - 2020</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#ffffff' }}>BSc in Information Tech</h4>
                  <p style={{ fontSize: '8.5pt', color: '#94a3b8', margin: '2px 0' }}>Woldia University</p>
                  <p style={{ fontSize: '8pt', color: '#64748b', margin: 0 }}>2014 - 2018</p>
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff', textTransform: 'uppercase' }}>Languages</h3>
              <div style={{ fontSize: '9pt', color: '#cbd5e1' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span>English</span>
                  <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} style={{ width: '12px', height: '6px', backgroundColor: i <= 7 ? '#0ea5e9' : '#334155' }}></div>)}
                  </div>
                </div>
                <div>
                  <span>Amharic</span>
                  <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} style={{ width: '12px', height: '6px', backgroundColor: '#0ea5e9' }}></div>)}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center', fontSize: '8pt', color: '#475569' }}>
          Designed for developers • Generated via Portfolio
        </div>
      </div>
    </>
  );
};

export default ResumeDownload;

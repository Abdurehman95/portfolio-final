import React, { useState, useEffect, useRef } from 'react';
import ResumeDownload from './ResumeDownload';


const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const canvasRef = useRef(null);

  // Typing Effect
  useEffect(() => {
    const texts = [
      'Fullstack Developer',
      'React Specialist',
      'Web Developer',
      'Problem Solver'
    ];

    let timer;
    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Icon Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];

    // Skill Icons (FontAwesome Unicodes)
    // React, JS, HTML5, CSS3, Node, Git, Database, Code
    const icons = ['\uf41b', '\uf3b8', '\uf13b', '\uf13c', '\uf419', '\uf1d3', '\uf1c0', '\uf121'];

    // Colors consistent with theme
    const colors = ['rgba(14, 165, 233, 0.4)', 'rgba(126, 34, 206, 0.4)', 'rgba(255, 255, 255, 0.15)'];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.dx = (Math.random() - 0.5) * 0.5; // Slower movement
        this.dy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 15 + 10; // Icon size 10-25px
        this.icon = icons[Math.floor(Math.random() * icons.length)];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;
        this.rotation += this.rotationSpeed;

        if (this.x > width + 50) this.x = -50;
        if (this.x < -50) this.x = width + 50;
        if (this.y > height + 50) this.y = -50;
        if (this.y < -50) this.y = height + 50;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.font = `${this.size}px "Font Awesome 5 Brands", "Font Awesome 6 Brands", "FontAwesome"`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, 0, 0);

        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.floor(width * 0.03); // Fewer particles as they are larger icons
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background Canvas for Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between relative z-10">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 fade-in-left text-center lg:text-left">
            Hi, I'm <span className="gradient-text">Abdurehman Seid</span>
          </h1>
          <div className="hero-title fade-in-left stagger-1 text-center lg:text-left">
            <span className="title-prefix"></span>
            <span className="typing-text">{text}</span>
            <span className="cursor"></span>
          </div>
          <p className="text-lg mb-8 text-slate-400 max-w-lg fade-in-left stagger-2 text-center lg:text-left">
            I build exceptional digital experiences that are fast, accessible, and visually appealing.
            Let's create something amazing together.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4 fade-in-left stagger-3">
            <a href="#contact" className="px-6 py-3 rounded-full btn-primary font-medium">Hire Me</a>
            <ResumeDownload />

          </div>
          <div className="flex justify-center lg:justify-start mt-8 space-x-4 fade-in-left stagger-4">
            <a href="https://github.com/Abdurehman95" target="_blank" rel="noopener noreferrer" className="social-icon text-xl w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:text-white">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="social-icon text-xl w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:text-white">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="social-icon text-xl w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://t.me/abdu_8995" target="_blank" rel="noopener noreferrer" className="social-icon text-xl w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:text-white">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center fade-in-right mb-12 lg:mb-0">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-2xl opacity-30 pulse-animation"></div>
            <img
              src="/image.png"
              alt="Profile"
              className="relative w-full h-full object-cover rounded-full border-4 border-slate-800 floating shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

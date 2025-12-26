import React, { useState, useEffect } from 'react';
import {motion, stagger, useScroll, useSpring, Variants} from 'framer-motion';
import { 
  Moon, Sun, Monitor, Github, Linkedin, ExternalLink, Mail, ArrowRight, Code, Bot,
  Twitter, Facebook, Instagram, Download
} from 'lucide-react';
import Terminal from './components/Terminal';
import ChatAssistant from './components/ChatAssistant';
import CustomCursor from './components/CustomCursor';
import { PORTFOLIO_DATA } from './constants';
import { Project, Theme } from './types';
// @ts-ignore
import photo from './assets/photo.webp';
// @ts-ignore
import resume from './assets/resume.pdf';

// Helper for icons using Devicon classes
const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase();
  let iconClass = "devicon-code-plain"; // fallback

  if (t.includes('react')) iconClass = "devicon-react-original";
  else if (t.includes('kotlin')) iconClass = "devicon-kotlin-plain";
  else if (t.includes('android')) iconClass = "devicon-android-plain";
  else if (t.includes('java')) iconClass = "devicon-java-plain";
  else if (t.includes('spring')) iconClass = "devicon-spring-plain";
  else if (t.includes('node')) iconClass = "devicon-nodejs-plain";
  else if (t.includes('mongo')) iconClass = "devicon-mongodb-plain";
  else if (t.includes('docker')) iconClass = "devicon-docker-plain";
  else if (t.includes('git')) iconClass = "devicon-git-plain";
  else if (t.includes('figma')) iconClass = "devicon-figma-plain";
  else if (t.includes('compose')) iconClass = "devicon-jetpackcompose-plain";
  else if (t.includes('tailwind')) iconClass = "devicon-tailwindcss-plain";
  else if (t.includes('typescript') || t.includes('ts')) iconClass = "devicon-typescript-plain";
  else if (t.includes('html')) iconClass = "devicon-html5-plain";
  else if (t.includes('tensorflow')) iconClass = "devicon-tensorflow-original";
  else if (t.includes('linux')) iconClass = "devicon-linux-plain";

  // Manual overrides for things not in simple mapping or needing specific visuals
  if (t.includes('gemini') || t.includes('ai')) return <Bot size={20} />;
  if (t.includes('kobweb')) return <Code size={20} />; 

  return <i className={`${iconClass} text-2xl`} />;
};

// Side Navigation Component
const SideNav = ({ activeSection }: { activeSection: string }) => {
  const sections = ['home', 'skills', 'projects', 'experience', 'contact'];
  
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col">
      {sections.map((section) => (
        <a 
          key={section}
          href={`#${section}`}
          className="group flex items-center gap-4 justify-end"
        >
          <span className={`bg-black text-white px-4 py-2 text-lg font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity border-4 border-neo-primary whitespace-nowrap shadow-neo`}>
            {section}
          </span>
          <div 
            className={`w-4 h-4 border-2 border-black transition-all duration-300 ${
              activeSection === section 
                ? 'bg-neo-primary rotate-45 scale-150' 
                : 'bg-white hover:bg-neo-secondary'
            }`}
          />
        </a>
      ))}
    </div>
  );
};

// Extracted Components
const SectionTitle = ({ children, color = "bg-neo-primary" }: { children: React.ReactNode, color?: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="relative inline-block mb-16"
  >
    <h2 className={`text-5xl md:text-7xl font-black uppercase border-4 border-black px-6 py-3 relative z-10 bg-white dark:bg-black dark:text-white`}>
      {children}
    </h2>
    <div className={`absolute top-3 left-3 w-full h-full ${color} border-4 border-black -z-0`} />
  </motion.div>
);

const ProjectCard = ({project, index, key}: { project: Project, index: number, key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <motion.div 
        whileHover={{ y: -10, x: -10, boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)' }}
        className="bg-white dark:bg-zinc-900 border-4 border-black p-8 md:p-10 flex flex-col h-full shadow-neo transition-all"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl md:text-4xl font-bold font-mono leading-tight">{project.title}</h3>
          <span className="bg-black text-white px-3 py-1 text-base font-bold font-mono border-2 border-transparent">{project.year}</span>
        </div>
        <p className="mb-8 font-medium text-lg md:text-xl text-gray-700 dark:text-gray-300 flex-grow leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {project.tech.map(t => (
            <span key={t} className="bg-neo-secondary/30 border-2 border-black px-3 py-1.5 text-sm font-bold uppercase flex items-center gap-2">
              {getTechIcon(t)}
              {t}
            </span>
          ))}
        </div>
        <a 
          href={project.link}
          className="mt-auto bg-neo-primary text-white border-4 border-black py-3 px-6 text-lg font-black uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors group"
        >
          View Project <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
        </a>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', message: '' });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track active section for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'experience', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjusted detection range for larger sections
          if (rect.top >= -300 && rect.top <= 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === Theme.LIGHT) setTheme(Theme.DARK);
    else if (theme === Theme.DARK) setTheme(Theme.RETRO);
    else setTheme(Theme.LIGHT);
  };

  useEffect(() => {
    document.documentElement.className = theme === Theme.DARK ? 'dark' : '';
  }, [theme]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = formData.message;
    window.location.href = `mailto:${PORTFOLIO_DATA.socials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // General reveal animation variant
  const revealVar: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === Theme.DARK ? 'bg-zinc-900 text-white' : 
      theme === Theme.RETRO ? 'bg-[#fdf6e3] text-[#657b83]' : 
      'bg-[#f0f0f0] text-black'
    }`}>
      <CustomCursor />
      <SideNav activeSection={activeSection} />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-neo-primary origin-left z-[100] border-b-4 border-black"
        style={{ scaleX }}
      />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full p-4 md:p-6 z-50 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-white dark:bg-black border-4 border-black px-6 py-3 shadow-neo font-black text-2xl uppercase tracking-tighter hover:bg-neo-accent transition-colors">
          {PORTFOLIO_DATA.name}
        </div>
        <button 
          onClick={toggleTheme}
          className="pointer-events-auto bg-white dark:bg-black dark:text-white p-4 border-4 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
        >
          {theme === Theme.LIGHT ? <Moon size={28} /> : theme === Theme.DARK ? <Monitor size={28} /> : <Sun size={28} />}
        </button>
      </nav>

      <main className="container mx-auto px-6 pt-24 md:pt-20 pb-32">

        {/* Hero Section */}
        <section id="home" className="min-h-[80vh] flex items-center mb-32 md:mr-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left Column: Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative order-2 lg:order-1 flex justify-center lg:justify-end pr-0 lg:pr-12"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 group">
                <div className="absolute inset-0 bg-neo-accent translate-x-6 translate-y-6 border-4 border-black transition-transform group-hover:translate-x-8 group-hover:translate-y-8"></div>
                <div className="absolute inset-0 bg-neo-secondary -translate-x-6 -translate-y-6 border-4 border-black transition-transform group-hover:-translate-x-8 group-hover:-translate-y-8"></div>
                
                <div className="absolute inset-0 bg-white border-4 border-black overflow-hidden flex items-center justify-center relative z-10">
                  <motion.img 
                    src={photo}
                    alt="Trishit Majumdar"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute bottom-6 right-6 bg-black text-white px-4 py-2 font-mono font-bold text-sm md:text-base border-2 border-white">
                    ANDROID_DEV
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Text */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { delayChildren: stagger(0.1) } }
              }}
              className="order-1 lg:order-2 flex flex-col items-start"
            >
              <motion.div variants={revealVar} className="bg-neo-secondary inline-block px-4 py-2 border-4 border-black font-mono font-bold text-lg mb-6 shadow-neo-hover">
                v1.0.0 // HELLO_WORLD
              </motion.div>
              <motion.h1 variants={revealVar} className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-6 tracking-tighter">
                Hello, <br/>
                <span className="text-stroke text-transparent bg-clip-text bg-gradient-to-r from-neo-primary to-neo-accent" style={{ WebkitTextStroke: '3px black' }}>
                  Trishit Here!
                </span>
              </motion.h1>
              <motion.p variants={revealVar} className="text-xl md:text-2xl font-medium border-l-8 border-neo-primary pl-6 mb-10 max-w-xl leading-snug">
                {PORTFOLIO_DATA.about}
              </motion.p>
              <motion.div variants={revealVar} className="flex flex-wrap gap-6">
                <a href="#projects" className="bg-black text-white border-4 border-black px-8 py-4 text-xl font-bold uppercase hover:bg-white hover:text-black hover:shadow-neo transition-all flex items-center gap-3">
                  Explore Apps <ArrowRight size={24} />
                </a>
                <a href="#contact" className="bg-white text-black border-4 border-black px-8 py-4 text-xl font-bold uppercase hover:bg-neo-accent shadow-neo hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
                  Contact Me
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-40">
          <SectionTitle color="bg-neo-accent">Technical Arsenal</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {PORTFOLIO_DATA.skills.map((skillGroup, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="bg-white dark:bg-zinc-800 border-4 border-black p-8 shadow-neo hover:shadow-neo-deep transition-all"
              >
                <h3 className="text-3xl font-black uppercase mb-6 border-b-4 border-neo-secondary inline-block pb-2">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-4">
                  {skillGroup.items.map(skill => (
                    <li key={skill} className="flex items-center gap-3 font-mono font-bold text-lg">
                      {getTechIcon(skill)}
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-40">
          <SectionTitle color="bg-neo-secondary">Selected Works</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {PORTFOLIO_DATA.projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
          <div className="flex justify-center">
            <a 
              href={`https://${PORTFOLIO_DATA.socials.github}`} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white dark:bg-zinc-800 text-black dark:text-white border-4 border-black px-8 py-4 text-xl font-bold uppercase hover:bg-neo-primary hover:text-white shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3"
            >
              More Projects <Github size={24} />
            </a>
          </div>
        </section>

        {/* Experience / Education */}
        <section id="experience" className="mb-40">
          <SectionTitle color="bg-neo-primary">Education</SectionTitle>
          <div className="space-y-10 max-w-5xl">
            {PORTFOLIO_DATA.education.map((edu, idx) => (
              <motion.div 
                key={edu.id}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-8 bg-white dark:bg-zinc-900 border-4 border-black p-10 shadow-neo hover:translate-x-2 transition-transform"
              >
                <div className="md:w-1/4">
                  <span className="bg-neo-accent px-4 py-2 font-mono font-bold text-lg border-4 border-black inline-block">{edu.period}</span>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-3xl md:text-4xl font-black uppercase mb-2">{edu.role}</h3>
                  <h4 className="text-2xl font-bold text-gray-500 mb-4 font-mono">{edu.company}</h4>
                  <p className="font-medium text-xl leading-relaxed">{edu.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-32">
          <SectionTitle color="bg-neo-accent">Initiate Handshake</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black text-white p-10 border-4 border-neo-primary shadow-neo-deep"
            >
              <h3 className="text-4xl md:text-5xl font-black uppercase mb-8">Let's Build The Future</h3>
              <p className="text-2xl mb-12 font-mono leading-relaxed">
                Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href={`https://${PORTFOLIO_DATA.socials.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Github size={32} /> GitHub
                </a>
                <a href={`https://${PORTFOLIO_DATA.socials.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Linkedin size={32} /> LinkedIn
                </a>
                <a href={`mailto:${PORTFOLIO_DATA.socials.email}`} className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Mail size={32} /> Email
                </a>
                <a href={`https://${PORTFOLIO_DATA.socials.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Twitter size={32} /> X / Twitter
                </a>
                <a href={`https://${PORTFOLIO_DATA.socials.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Instagram size={32} /> Instagram
                </a>
                 <a href={`https://${PORTFOLIO_DATA.socials.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neo-secondary transition-colors font-bold">
                  <Facebook size={32} /> Facebook
                </a>
              </div>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-zinc-800 border-4 border-black p-10 shadow-neo flex flex-col gap-8" 
              onSubmit={handleContactSubmit}
            >
              <div>
                <label className="block text-xl font-black uppercase mb-3">Identify Yourself</label>
                <input 
                  type="text" 
                  className="w-full bg-neo-bg border-4 border-black p-5 text-lg font-bold focus:outline-none focus:shadow-neo transition-all" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xl font-black uppercase mb-3">Transmission</label>
                <textarea 
                  rows={5} 
                  className="w-full bg-neo-bg border-4 border-black p-5 text-lg font-bold focus:outline-none focus:shadow-neo transition-all" 
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="bg-neo-primary text-white border-4 border-black py-5 font-black text-xl uppercase tracking-widest hover:bg-black transition-colors hover:shadow-neo-hover">
                Send Message
              </button>
            </motion.form>
          </div>
        </section>

        {/* Resume Download Section */}
        <section className="mb-16 flex justify-center">
          <a 
            href={resume} 
            download="Trishit_Majumdar_Resume.pdf"
            className="bg-neo-accent text-black border-4 border-black px-10 py-5 text-2xl font-black uppercase hover:bg-white hover:shadow-neo transition-all flex items-center gap-4 shadow-neo-deep"
          >
            Download Resume <Download size={32} />
          </a>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t-8 border-neo-primary">
        <div className="container mx-auto px-6 text-center">
          <p className="font-mono font-bold text-xl mb-6">
            DESIGNED & BUILT BY {PORTFOLIO_DATA.name.toUpperCase()}
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <Code size={32} />
            <Monitor size={32} />
            <Bot size={32} />
          </div>
          <p className="text-base text-gray-500">
            © {new Date().getFullYear()} // NEO_FOLIO_V1
          </p>
        </div>
      </footer>

      {/* Interactive Elements */}
      <Terminal />
      <ChatAssistant />
    </div>
  );
}

export default App;
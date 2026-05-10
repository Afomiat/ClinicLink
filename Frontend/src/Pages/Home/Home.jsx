import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCommentMedical, FaClinicMedical, FaArrowRight, FaHeartbeat, FaBrain, FaAward, FaUserFriends, FaClinicMedical as FaHospital } from 'react-icons/fa';
import './home.css';
import doctorImage from '../../assets/doc.png'; 
import logo from '../../assets/logo-2.png';
const Home = () => {
  const [currentDoctor, setCurrentDoctor] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);

  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const doctorsRef = useRef(null);
  const aboutRef = useRef(null);
  const tipsRef = useRef(null);
  const contactRef = useRef(null);

const scrollToSection = (ref, name) => {
  if (ref && ref.current) {
    setIsScrolling(true);
    const headerHeight = 80;
    const elementPosition = ref.current.offsetTop - headerHeight;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    setActiveSection(name);
    
    setTimeout(() => setIsScrolling(false), 1000);
  }
};

useEffect(() => {
  const handleScroll = () => {
    if (isScrolling) return; 

    const scrollY = window.scrollY + 90;
    
    const sectionMap = {
      home: homeRef,
      services: servicesRef,
      doctors: doctorsRef,
      about: aboutRef,
      tips: tipsRef,
      contact: contactRef,
    };

    for (const [name, ref] of Object.entries(sectionMap)) {
      if (ref.current &&
          scrollY >= ref.current.offsetTop &&
          scrollY < ref.current.offsetTop + ref.current.offsetHeight) {
        setActiveSection(name);
        break;
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [isScrolling]); 


  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15 years",
      education: "MD, Harvard Medical School",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      icon: <FaHeartbeat className="doctor-icon" />,
      available: "Mon, Wed, Fri",
      rating: 4.7,
      reviews: 128,
      bio: "Specializes in interventional cardiology with 500+ successful procedures."
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12 years",
      education: "PhD Neurology, Johns Hopkins",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      icon: <FaBrain className="doctor-icon" />,
      available: "Tue, Thu, Sat",
      rating: 4.7,
      reviews: 128,
      bio: "Expert in neurodegenerative disorders and cutting-edge treatments."
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "8 years",
      education: "MD Pediatrics, Stanford",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      icon: <FaClinicMedical className="doctor-icon" />,
     rating: 4.7,
     reviews: 128,
      available: "Mon-Fri",
      bio: "Passionate about child development and preventive pediatric care."
    }
  ];

  const nextDoctor = () => {
    setCurrentDoctor((prev) => (prev === doctors.length - 1 ? 0 : prev + 1));
  };

  const prevDoctor = () => {
    setCurrentDoctor((prev) => (prev === 0 ? doctors.length - 1 : prev - 1));
  };

  return (
    <div className="home-container">
      {/* Navigation Bar (unchanged) */}
      <nav className="healthcare-nav">
        <div className="nav-container">
          <div className="logo">
            <img src={logo} alt="HealthPlus Logo" className="logoImage" />
            <span>HealthPlus</span>
          </div>
          <ul className="nav-links">
  <li>
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(homeRef, 'home');
      }}
      className={activeSection === 'home' ? 'active' : ''}
    >
      Home
    </a>
  </li>
  <li>
    <a
      href="#services"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(servicesRef, 'services');
      }}
      className={activeSection === 'services' ? 'active' : ''}
    >
      Services
    </a>
  </li>
  <li>
    <a
      href="#doctors"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(doctorsRef, 'doctors');
      }}
      className={activeSection === 'doctors' ? 'active' : ''}
    >
      Doctors
    </a>
  </li>
  <li>
    <a
      href="#about"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(aboutRef, 'about');
      }}
      className={activeSection === 'about' ? 'active' : ''}
    >
      About
    </a>
  </li>
  <li>
    <a
      href="#tips"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(tipsRef, 'tips');
      }}
      className={activeSection === 'tips' ? 'active' : ''}
    >
      Health Tips
    </a>
  </li>
  <li>
    <a
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(contactRef, 'contact');
      }}
      className={activeSection === 'contact' ? 'active' : ''}
    >
      Contact
    </a>
  </li>
  <li>
    <a href="/login" className="login-btn">
      Login
    </a>
  </li>
</ul>

          {/* <div className="mobile-menu-btn">☰</div> */}
        </div>
      </nav>


      {/* Hero Section (unchanged) */}
      <section className="hero" ref={homeRef}>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Advanced Healthcare for Your Family</h1>
          <p>Compassionate care, cutting-edge technology, and personalized treatment plans</p>
          <div className="cta-buttons">
            <button className="secondary-btn">Go to Dashboard  <FaArrowRight /></button>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src={doctorImage} 
            alt="Professional doctor"
            className="doctor-cutout"
          />
        </div>
      </div>
    </section>
      
      {/* Wave Divider (unchanged) */}
      <div className="custom-shape-divider-bottom-1747806209">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
        </svg>
      </div>

      {/* Features Section (unchanged) */}
      <section className="features-section" ref={servicesRef}>
  <div className="section-header">
    <h2 className="section-title">
      <span>Our Healthcare Services</span>
      <span className="title-underline"></span>
    </h2>
    <p className="section-subtitle">Comprehensive care for all your health needs</p>
  </div>

  <div className="features-grid">
    <div className="feature-card" data-aos="fade-up">
      <div className="icon-container">
      <svg className="feature-icon group-hover:fill-white transition duration-300" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          <path d="M2 8c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4"/>
          <path d="M9 2v2"/>
          <path d="M15 2v2"/>
        </svg>
      </div>
      <h3 className="feature-title">Emergency Care</h3>
      <p className="feature-description">24/7 emergency services with board-certified physicians ready when you need us most.</p>
      <div className="feature-hover">
        {/* <a href="#" className="feature-link">Learn more <span>→</span></a> */}
      </div>
    </div>

    <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
      <div className="icon-container">
      <svg className="feature-icon group-hover:fill-white transition duration-300" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
          <path d="M8.5 8.5v.01"/>
          <path d="M16 15.5v.01"/>
          <path d="M12 12v.01"/>
          <path d="M11 17v.01"/>
          <path d="M7 14v.01"/>
        </svg>
      </div>
      <h3 className="feature-title">Specialized Treatments</h3>
      <p className="feature-description">Advanced care in cardiology, neurology, oncology, and more with cutting-edge technology.</p>
      <div className="feature-hover">
        {/* <a href="#" className="feature-link">Learn more <span>→</span></a> */}
      </div>
    </div>

    <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
      <div className="icon-container">
      <svg className="feature-icon group-hover:fill-white transition duration-300" viewBox="0 0 24 24">
          <path d="M19 14c1.5-1.5 3-3.5 3-6a8 8 0 1 0-16 0c0 2.5 1.5 4.5 3 6"/>
          <path d="M12 14v-3"/>
          <path d="M10 11h4"/>
          <path d="M12 17v.01"/>
          <path d="M10 17v.01"/>
          <path d="M14 17v.01"/>
          <path d="M8 14a20 20 0 0 0 8 0"/>
        </svg>
      </div>
      <h3 className="feature-title">Pediatric Care</h3>
      <p className="feature-description">Compassionate specialists dedicated to your child's health and development.</p>
      <div className="feature-hover">
        {/* <a href="#" className="feature-link">Learn more <span>→</span></a> */}
      </div>
    </div>
  </div>
</section>

      {/* Premium Doctors Section */}
      <section className="premium-doctors" ref={doctorsRef}>
        <div className="section-header">
          <h2>Meet Our Specialist Team</h2>
          <p className="section-subtitle">Board-certified professionals dedicated to your health</p>
        </div>

        <div className="doctors-carousel">
          <button className="carousel-btn prev" onClick={prevDoctor}>
            <FaArrowLeft />
          </button>

          <div className="doctor-card active">
            <div className="doctor-image-container">
              <img src={doctors[currentDoctor].image} alt={doctors[currentDoctor].name} className="doctor-image" />
              {/* <div className="doctor-badge">
                <span>{doctors[currentDoctor].available}</span>
              </div> */}
            </div>
            <div className="doctor-details">
              <div className="doctor-icon-container">
                {doctors[currentDoctor].icon}
              </div>
              <h3 className="doctor-name">{doctors[currentDoctor].name}</h3>
              <p className="doctor-specialty">{doctors[currentDoctor].specialty}</p>
              <div className="doctor-info">
                <p><strong>Experience:</strong> {doctors[currentDoctor].experience}</p>
                <p><strong>Education:</strong> {doctors[currentDoctor].education}</p>
                <p className="doctor-bio">{doctors[currentDoctor].bio}</p>
              </div>
                <div className="doctor-actions">
                <div className="doctor-rating">
                    <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                        key={star}
                        className={`star ${star <= doctors[currentDoctor].rating ? 'filled' : ''}`}
                        >
                        ★
                        </span>
                    ))}
                    </div>
                    <span className="rating-text">{doctors[currentDoctor].rating}/5 ({doctors[currentDoctor].reviews}+ reviews)</span>
                </div>
              
                </div>
                            </div>
          </div>

          <button className="carousel-btn next" onClick={nextDoctor}>
            <FaArrowRight />
          </button>
        </div>

        <div className="carousel-dots">
          {doctors.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentDoctor ? 'active' : ''}`}
              onClick={() => setCurrentDoctor(index)}
            />
          ))}
        </div>
      </section>
            {/* About Us Section */}
      <section className="about-section" ref={aboutRef}>
        <div className="about-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About HealthPlus</h2>
              <p className="about-description">
                Founded in 2005, HealthPlus has grown from a single clinic to a leading healthcare provider with multiple 
                specialized centers across the region. Our mission is to deliver exceptional, personalized healthcare 
                using the latest medical advancements.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <FaHospital className="stat-icon" />
                  <div>
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Specialized Centers</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaUserFriends className="stat-icon" />
                  <div>
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Medical Professionals</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaAward className="stat-icon" />
                  <div>
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Medical Awards</span>
                  </div>
                </div>
              </div>
            </div>
       <div className="svg-image-container">
        <div className="blob-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
            alt="Doctor with patient" 
            className="blob-image"
          />
        </div>
      </div>
          </div>
          
          <div className="mission-vision">
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p>To provide compassionate, high-quality healthcare that improves the lives of our patients through innovative treatments and personalized care.</p>
            </div>
            <div className="vision-card">
              <h3>Our Vision</h3>
              <p>To be the most trusted healthcare provider in the region, recognized for excellence in patient outcomes and medical innovation.</p>
            </div>
          </div>
        </div>
      </section>



 {/* Enhanced Health Tips Section */}
      <section className="health-tips" ref={tipsRef}>
  <div className="section-header">
    <h2 className="section-title">
      <span className="title-text">Health & Wellness Tips</span>
      <span className="title-underline"></span>
    </h2>
    <p className="section-subtitle">Expert advice for a healthier lifestyle</p>
  </div>
  
  <div className="tips-grid">
    <div className="tip-card" data-aos="fade-up" data-aos-delay="100">
      <div className="card-icon">
        <svg className="animated-icon" viewBox="0 0 24 24">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
        </svg>
      </div>
      <h3 className="card-title">Preventive Care</h3>
      <p className="card-text">Regular check-ups can detect health issues early when they're most treatable.</p>
      <div className="card-hover-content">
        {/* <button className="card-button">Learn More</button> */}
      </div>
    </div>
    
    <div className="tip-card" data-aos="fade-up" data-aos-delay="200">
      <div className="card-icon">
        <svg className="animated-icon" viewBox="0 0 24 24">
          <path d="M18 6l-1.41-1.41-6.34 6.34 1.41 1.41L18 6zm4.62-1.63L11.66 16.17 7.48 12l-1.41 1.41 5.18 5.18 11.46-11.46-1.42-1.42zM.69 5.51l5.18 5.17L1.41 12 0 10.59l4.17-4.17L.69 5.51z"/>
        </svg>
      </div>
      <h3 className="card-title">Healthy Living</h3>
      <p className="card-text">Small changes in diet and exercise can lead to big improvements in health.</p>
      <div className="card-hover-content">
        {/* <button className="card-button">Learn More</button> */}
      </div>
    </div>
    
    <div className="tip-card" data-aos="fade-up" data-aos-delay="300">
      <div className="card-icon">
        <svg className="animated-icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <h3 className="card-title">Mental Health</h3>
      <p className="card-text">Your mental wellbeing is just as important as your physical health.</p>
      <div className="card-hover-content">
        {/* <button className="card-button">Learn More</button> */}
      </div>
    </div>
  </div>
</section>
<footer className="premium-footer" ref={contactRef}>
  <div className="footer-wave">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#1a7bd5"></path>
      <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#1a7bd5"></path>
      <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#1a7bd5"></path>
    </svg>
  </div>

  <div className="footer-content">
    <div className="footer-container">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            {/* <img src={logoImage} alt="HealthPlus Logo" className="logo-img tiny-logo" /> */}
            <span>HealthPlus</span>
          </div>
          <p className="footer-tagline">Advanced healthcare for modern families</p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.05.05 1.62.22 2 .37.52.19.9.42 1.29.81.39.39.62.77.81 1.29.15.38.32.95.37 2 .07 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.05-.22 1.62-.37 2-.19.52-.42.9-.81 1.29-.39.39-.77.62-1.29.81-.38.15-.95.32-2 .37-1.27.07-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.05-.05-1.62-.22-2-.37-.52-.19-.9-.42-1.29-.81a3.39 3.39 0 0 1-.81-1.29c-.15-.38-.32-.95-.37-2-.07-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85c.05-1.05.22-1.62.37-2 .19-.52.42-.9.81-1.29.39-.39.77-.62 1.29-.81.38-.15.95-.32 2-.37 1.27-.07 1.65-.07 4.85-.07zm0-2.16c-3.27 0-3.69.01-4.98.07-1.23.06-1.89.25-2.56.54-.69.3-1.27.7-1.85 1.28S2.47 3.82 2.17 4.51c-.29.67-.48 1.33-.54 2.56C1.01 8.31 1 8.73 1 12s.01 3.69.07 4.98c.06 1.23.25 1.89.54 2.56.3.69.7.7 1.27 1.28 1.85s1.16.98 1.85 1.28c.67.29 1.33.48 2.56.54 1.29.06 1.71.07 4.98.07s3.69-.01 4.98-.07c1.23-.06 1.89-.25 2.56-.54.69-.3 1.27-.7 1.85-1.28s.98-1.16 1.28-1.85c.29-.67.48-1.33.54-2.56.06-1.29.07-1.71.07-4.98s-.01-3.69-.07-4.98c-.06-1.23-.25-1.89-.54-2.56-.3-.69-.7-1.27-1.28-1.85s-1.16-.98-1.85-1.28c-.67-.29-1.33-.48-2.56-.54C15.69 0 15.27 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.42-10.15a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h4 className="links-title">Services</h4>
            <ul className="links-list">
              <li><a href="#">Primary Care</a></li>
              <li><a href="#">Specialty Care</a></li>
              <li><a href="#">Emergency Services</a></li>
              <li><a href="#">Telemedicine</a></li>
              <li><a href="#">Wellness Programs</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h4 className="links-title">Quick Links</h4>
            <ul className="links-list">
              <li><a href="#">Find a Doctor</a></li>
              <li><a href="#">Patient Portal</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">News & Blog</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h4 className="links-title">Contact Us</h4>
            <ul className="links-list contact-info">
              <li>
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>123 Medical Drive, Health City, HC 12345</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                <span>(123) 456-7890</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>info@healthplus.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-container">
        <div className="copyright">
          &copy; {new Date().getFullYear()} HealthPlus. All rights reserved.
        </div>
        <div className="legal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">HIPAA Compliance</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>
  );
};

export default Home;
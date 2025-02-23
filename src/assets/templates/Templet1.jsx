import React, { useEffect, useRef, useState } from 'react';

const A4_HEIGHT_PX = parseInt(process.env.REACT_APP_A4_HEIGHT_PX, 10);
const A4_WIDTH_PX = parseInt(process.env.REACT_APP_A4_WIDTH_PX, 10);

const styles = {
  // Previous styles remain the same
  container: {
    // backgroundColor: 'white',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    lineHeight: '1.6',
    margin: '20px auto',
  },
  page: {
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    padding: '40px',
    backgroundColor: 'white',
    margin: '20px auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    position: 'relative',
    paddingTop: '20px'
  },
  headerIcon: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#FFD700',
    fontSize: '24px'
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#000'
  },
  contactInfo: {
    fontSize: '14px',
    color: '#000'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2E74B5',
    marginBottom: '15px',
    border: 'none'
  },
  bulletItem: {
    marginLeft: '20px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'flex-start',
    color: '#000'
  },
  bullet: {
    marginRight: '10px',
    color: '#000'
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  experienceTitle: {
    fontSize: '14px',
    fontWeight: 'normal'
  },
  experienceLocation: {
    fontStyle: 'normal',
    color: '#000'
  },
  experienceDate: {
    fontStyle: 'italic'
  },
  summary: {
    marginLeft: '20px',
    lineHeight: '1.6',
    fontSize: '14px'
  },
  pageNumber: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontSize: '12px',
    color: '#666'
  }
};

const Template1 = ({ resumeData }) => {
  const {
    name=" ",
    email=" ",
    phone=" ",
    skills=[],
    experience=[],
    education=[],
    projects=[],
    achievements=[],
    generatedText=" "
  } = resumeData || {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St, Cityville, USA",
        linkedIn: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.dev",
        summary: "Experienced full-stack developer with 5+ years of expertise in building scalable web applications. Proficient in JavaScript, React, and Node.js, with a strong focus on user-centric design and performance optimization.",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "TypeScript", "REST APIs", "GraphQL", "Git", "Agile Development"],
        experience: [
          {
            title: "Senior Developer",
            company: "TechCorp Solutions",
            description: "Led a team of 5 developers in building scalable, high-performance web applications using React, Node.js, and MongoDB. Improved application performance by 30% through code optimization and implementing best practices.",
            duration: "2020-2023",
            location: "San Francisco, CA",
            achievements: [
              "Developed a customer support chatbot, reducing response time by 40%.",
              "Integrated CI/CD pipelines, improving deployment efficiency by 50%.",
            ],
          },
          {
            title: "Frontend Developer",
            company: "Innovatech Inc.",
            description: "Designed and developed user interfaces for enterprise applications using React and Redux. Collaborated with cross-functional teams to deliver high-quality software on tight deadlines.",
            duration: "2017-2020",
            location: "New York, NY",
            achievements: [
              "Redesigned the main dashboard, resulting in a 20% increase in user satisfaction.",
              "Mentored junior developers, improving team productivity.",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Technology",
            year: "2013-2017",
            location: "Cityville, USA",
            highlights: [
              "Graduated with honors.",
              "Member of the Programming Club.",
            ],
          },
          {
            degree: "High School Diploma",
            institution: "Cityville High School",
            year: "2011-2013",
            location: "Cityville, USA",
            highlights: [
              "Excelled in Mathematics and Computer Science.",
              "Won the regional coding competition.",
            ],
          },
        ],
        projects: [
          {
            title: "E-commerce Platform",
            description: "Built a fully-featured e-commerce platform using MERN stack. Implemented payment gateways, product search, and user authentication.",
            technologies: ["React", "Node.js", "Express", "MongoDB"],
            link: "https://github.com/johndoe/ecommerce-platform",
          },
          {
            title: "Portfolio Website",
            description: "Created a responsive portfolio website showcasing personal projects and achievements. Used React and Tailwind CSS for design.",
            technologies: ["React", "Tailwind CSS"],
            link: "https://johndoe.dev",
          },
        ],
        achievements: [
          {
            title: "Employee of the Year",
            organization: "TechCorp Solutions",
            year: "2022",
            description: "Recognized for outstanding contributions to the development team and successful project delivery.",
          },
          {
            title: "Best Hackathon Project",
            organization: "Innovatech Hackathon",
            year: "2019",
            description: "Won first place for developing a real-time chat application.",
          },
          {
            title: "Best Hackathon Project",
            organization: "Innovatech Hackathon",
            year: "2019",
            description: "Won first place for developing a real-time chat application.",
          },
          {
            title: "Best Hackathon Project",
            organization: "Innovatech Hackathon",
            year: "2019",
            description: "Won first place for developing a real-time chat application.",
          },
          {
            title: "Best Hackathon Project",
            organization: "Innovatech Hackathon",
            year: "2019",
            description: "Won first place for developing a real-time chat application.",
          },
          {
            title: "Best Hackathon Project",
            organization: "Innovatech Hackathon",
            year: "2019",
            description: "Won first place for developing a real-time chat application.",
          },
        ],
  };

  const [pages, setPages] = useState([[]]);
  const contentRef = useRef(null);

  const Section = ({ title, children }) => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );

  const BulletItem = ({ children }) => (
    <div style={styles.bulletItem}>
      <span style={styles.bullet}>•</span>
      {children}
    </div>
  );

  // Function to organize content into pages
  useEffect(() => {
    if (contentRef.current) {
      const elements = Array.from(contentRef.current.children);
      const newPages = [[]];
      let currentPage = 0;
      let currentHeight = 0;

      elements.forEach((element) => {
        const elementHeight = element.offsetHeight;
        
        // Check if adding this element would exceed page height
        if (currentHeight + elementHeight > A4_HEIGHT_PX - 80) { // 80px buffer for margins
          currentPage++;
          currentHeight = 0;
          newPages[currentPage] = [];
        }
        
        newPages[currentPage].push(element.cloneNode(true));
        currentHeight += elementHeight;
      });

      setPages(newPages);
    }
  }, [resumeData]);

  // Render each page
  return (
    <div style={styles.container}>
      {/* Hidden content for measurement */}
      <div ref={contentRef} style={{ position: 'absolute', visibility: 'hidden', width: `${A4_WIDTH_PX - 80}px` }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.name}>{name}</h1>
          <p style={styles.contactInfo}>
            {email} | {phone}
          </p>
        </div>

        <Section title="Skills">
          {skills.map((skill, index) => (
            <BulletItem key={index}>
              <span>{typeof skill === 'object' ? skill.skillName : skill}</span>
            </BulletItem>
          ))}
        </Section>

        <Section title="Professional Experience">
          {experience.map((exp, index) => (
            <BulletItem key={index}>
              <div>
                <span style={styles.bold}>{exp.title}</span>
                <span> | </span>
                <span style={styles.experienceLocation}>{exp.description}</span>
                <span> | </span>
                <span style={styles.experienceDate}>{exp.duration || 'Current'}</span>
              </div>
            </BulletItem>
          ))}
        </Section>

        <Section title="Education">
          {education.map((edu, index) => (
            <BulletItem key={index}>
              <div>
                <span>{edu.institution}</span>
                <span> | </span>
                <span>{edu.degree}</span>
                <span> | </span>
                <span style={styles.italic}>{edu.duration || 'Current'}</span>
              </div>
            </BulletItem>
          ))}
        </Section>

        <Section title="Projects">
          {projects.map((proj, index) => (
            <BulletItem key={index}>
              <div>
                <span style={styles.bold}>{proj.title}: </span>
                <span>{proj.description}</span>
              </div>
            </BulletItem>
          ))}
        </Section>

        <Section title="Achievements">
          {achievements.map((ach, index) => (
            <BulletItem key={index}>
              <div>
                <span>{ach.title}: </span>
                <span>{ach.description}</span>
              </div>
            </BulletItem>
          ))}
        </Section>

        <Section title="Professional Summary">
          <p style={styles.summary}>{generatedText}</p>
        </Section>
      </div>

      {/* Render actual pages */}
      {pages.map((pageContent, pageIndex) => (
        <div key={pageIndex} style={styles.page}>
          {pageContent.map((element, elementIndex) => (
            <div key={elementIndex} dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
          ))}
          <div style={styles.pageNumber}>Page {pageIndex + 1} of {pages.length}</div>
        </div>
      ))}
    </div>
  );
};

export default Template1;
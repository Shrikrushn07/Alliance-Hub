import { Opportunity, Student, Team, Application, TeamInvitation } from '../types';

export const CURRENT_STUDENT: Student = {
  id: 'student-shrikrushn-01',
  name: 'Shrikrushn Bhise',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  department: 'Computer Science & Engineering',
  degree: 'B.Tech in Artificial Intelligence & Machine Learning',
  year: '3rd Year',
  campus: 'Alliance Central Campus, Bengaluru',
  bio: 'Passionate AI developer and full-stack builder focused on autonomous agent systems, distributed backend infrastructure, and high-performance React architectures.',
  suggestedRole: 'Lead AI & Full-Stack Architect',
  skills: [
    'Python',
    'PyTorch',
    'React',
    'TypeScript',
    'FastAPI',
    'PostgreSQL',
    'Docker',
    'Tailwind CSS',
    'Machine Learning',
    'Git'
  ],
  interests: [
    'Generative AI',
    'Autonomous Systems',
    'Smart Campus IoT',
    'FinTech Infrastructure',
    'Competitive Hackathons'
  ],
  portfolioUrl: 'https://shrikrushn.dev',
  githubUrl: 'https://github.com/shrikrushn0101',
  linkedinUrl: 'https://linkedin.com/in/shrikrushn-bhise',
  experienceLevel: 'Advanced',
  availabilityHoursPerWeek: 15,
  achievements: [
    '1st Place — Alliance Smart Campus Hackathon 2025',
    'Finalist — National Smart India Hackathon (SIH) 2025',
    'Lead Coordinator — Alliance Developer Student Club (ADSC)',
    'Published Research Paper: Efficient Inference for Small Language Models'
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Undergraduate AI Research Fellow',
      companyOrLab: 'Alliance Centre for Intelligent Systems (ACIS)',
      location: 'Bengaluru, India',
      period: 'Jan 2026 — Present',
      description: 'Developing low-rank quantization kernels for local LLM inference on resource-constrained embedded edge computers. Benchmarked 3.4x throughput gains.',
      skills: ['Python', 'PyTorch', 'Docker', 'Linux']
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Engineering Intern',
      companyOrLab: 'AuraCampus Software Initiative',
      location: 'Alliance University Central Campus',
      period: 'May 2025 — Dec 2025',
      description: 'Architected university room scheduling and lab booking services handling concurrent requests from over 4,000 undergraduate students with 99.9% uptime.',
      skills: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AuraCampus AI',
      description: 'Campus-wide intelligent agent assisting 4,000+ students with course schedules, room navigation, and lab resource bookings.',
      techStack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL'],
      link: 'https://github.com/shrikrushn0101/auracampus',
      role: 'Lead Architect'
    },
    {
      id: 'proj-2',
      title: 'DrizzleFlow Workflow Engine',
      description: 'Distributed event-driven pipeline orchestrator for batch AI inference tasks on heterogeneous edge nodes.',
      techStack: ['Docker', 'PyTorch', 'Python', 'Redis'],
      link: 'https://github.com/shrikrushn0101/drizzleflow',
      role: 'Backend Engineer'
    },
    {
      id: 'proj-3',
      title: 'Alliance PeerMatch',
      description: 'Vector-similarity student collaboration discovery tool deployed for internal university hackathon team formation.',
      techStack: ['React', 'Tailwind CSS', 'FastAPI'],
      link: 'https://github.com/shrikrushn0101/peermatch',
      role: 'Full-Stack Developer'
    }
  ],
  certifications: [
    'DeepLearning.AI — Deep Learning Specialization',
    'AWS Certified Solutions Architect Associate',
    'Meta Front-End Developer Professional Certificate'
  ],
  verifiedStudent: true
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Alliance National Innovation Hackathon 2026',
    organizer: 'Centre for Innovation & Incubation (CII)',
    organizerType: 'University Department',
    verified: true,
    category: 'Hackathons',
    mode: 'In-Person',
    location: 'Alliance University Central Campus, Bengaluru',
    department: 'Cross-Disciplinary',
    deadline: '2026-11-20',
    eventDate: '2026-11-28 — 2026-11-30',
    stipendOrPrize: '₹3,50,000 Prize Pool + Seed Grants',
    description: 'Alliance University\'s flagship 36-hour hackathon focused on Smart Cities, Sustainable Energy, and Generative AI for Higher Education. 40 short-listed teams receive mentorship from top Bengaluru founders and VC investors.',
    responsibilities: [
      'Build a working proof-of-concept prototype within 36 consecutive hours',
      'Pitch live before an industry jury including tech executives and venture capitalists',
      'Demonstrate scalable architectural thinking and user-centric design'
    ],
    eligibility: 'Open to all undergraduate and postgraduate students from any recognized university. Teams of 2 to 4 members.',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Python', 'React', 'Machine Learning', 'API Development'],
    preferredSkills: ['Docker', 'FastAPI', 'UI/UX Design'],
    externalUrl: 'https://hackathon.alliance.edu.in',
    featured: true,
    totalApplicants: 184,
    openSpots: 40,
    contactEmail: 'cii@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Machine Learning',
        resourceName: 'Alliance ML Lab: PyTorch & Scikit-Learn Fast Track',
        resourceType: 'University Repository',
        url: 'https://github.com/alliance-ai-lab/ml-essentials',
        estimatedHours: 8
      },
      {
        skill: 'API Development',
        resourceName: 'Production REST & Async APIs with FastAPI',
        resourceType: 'Interactive Lab',
        url: 'https://fastapi.tiangolo.com/tutorial/',
        estimatedHours: 6
      }
    ]
  },
  {
    id: 'opp-2',
    title: 'Autonomous Drone Navigation Research Fellow',
    organizer: 'Aerospace & Robotics Research Laboratory',
    organizerType: 'Research Lab',
    verified: true,
    category: 'Research',
    mode: 'In-Person',
    location: 'Aero Lab 3, Anekal Campus',
    department: 'Alliance College of Engineering & Design',
    deadline: '2026-11-15',
    eventDate: 'Semester Project (6 Months)',
    stipendOrPrize: '₹18,000 / month + Co-Authorship',
    description: 'Undergraduate research fellow position investigating vision-language-action (VLA) navigation algorithms for indoor GPS-denied environments using lightweight edge compute platforms.',
    responsibilities: [
      'Implement real-time SLAM algorithms on Jetson Orin Nano modules',
      'Conduct controlled indoor flight tests in the UAV cage facility',
      'Co-author research manuscript for submission to IEEE IROS / ICRA'
    ],
    eligibility: '3rd or 4th Year B.Tech CSE, ECE, or Aerospace with minimum CGPA 8.0 and strong mathematical foundations.',
    eligibleDepartments: ['Computer Science & Engineering', 'Aerospace Engineering', 'Electronics & Communication'],
    eligibleYears: ['3rd Year', '4th Year'],
    requiredSkills: ['Python', 'PyTorch', 'ROS2', 'Computer Vision'],
    preferredSkills: ['C++', 'Linux', 'Mathematics'],
    externalUrl: 'https://aerolab.alliance.edu.in/fellowship',
    featured: true,
    totalApplicants: 36,
    openSpots: 2,
    contactEmail: 'robotics-lab@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'ROS2',
        resourceName: 'ROS2 Humble Fundamentals for Autonomous Systems',
        resourceType: 'Documentation',
        url: 'https://docs.ros.org/en/humble/',
        estimatedHours: 12
      },
      {
        skill: 'Computer Vision',
        resourceName: 'OpenCV & YOLOv8 Real-Time Detection Sandbox',
        resourceType: 'Interactive Lab',
        url: 'https://opencv.org/university/',
        estimatedHours: 10
      }
    ]
  },
  {
    id: 'opp-3',
    title: 'FinTech Platform Engineering Internship',
    organizer: 'Zerodha Technology Labs (Partner Program)',
    organizerType: 'Industry Partner',
    verified: true,
    category: 'Internships',
    mode: 'Hybrid',
    location: 'Bengaluru / Alliance Incubation Wing',
    department: 'Alliance School of Business & Engineering',
    deadline: '2026-11-25',
    eventDate: 'Jan 2027 — June 2027',
    stipendOrPrize: '₹45,000 / month + PPO Opportunity',
    description: 'Work directly alongside core platform architects building low-latency order routing services, WebSocket market streams, and reactive customer analytics dashboards.',
    responsibilities: [
      'Write clean, test-driven Go or Python microservices with high concurrent throughput',
      'Build responsive frontend interfaces with TypeScript, React, and Tailwind CSS',
      'Optimize database queries and indexing patterns in PostgreSQL'
    ],
    eligibility: 'Pre-final and Final year B.Tech/BBA/MBA students with demonstrated software engineering portfolio.',
    eligibleDepartments: ['Computer Science & Engineering', 'Alliance School of Business'],
    eligibleYears: ['3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['React', 'TypeScript', 'PostgreSQL', 'FastAPI'],
    preferredSkills: ['Go', 'Docker', 'Redis', 'Kafka'],
    externalUrl: 'https://careers.zerodha.com/campus-alliance',
    featured: true,
    totalApplicants: 142,
    openSpots: 5,
    contactEmail: 'campus-hiring@zerodhalabs.com',
    learningRoadmap: [
      {
        skill: 'PostgreSQL',
        resourceName: 'Advanced SQL Query Optimization & Partitioning',
        resourceType: 'Interactive Lab',
        url: 'https://use-the-index-luke.com/',
        estimatedHours: 5
      }
    ]
  },
  {
    id: 'opp-4',
    title: 'Alliance Venture Studio Pitch Competition 2026',
    organizer: 'Alliance School of Business — E-Cell',
    organizerType: 'Student Club',
    verified: true,
    category: 'Entrepreneurship',
    mode: 'In-Person',
    location: 'Auditorium 1, Learning Centre',
    department: 'Alliance School of Business',
    deadline: '2026-11-18',
    eventDate: '2026-12-05',
    stipendOrPrize: '₹5,00,000 Incubation Grant',
    description: 'Annual flagship student startup pitch challenge. Selected student founders receive 8 weeks of mentorship, prototype grants, legal registration support, and investor introductions.',
    responsibilities: [
      'Submit comprehensive 10-slide pitch deck covering problem, market, and unit economics',
      'Deliver 5-minute live demo and presentation to angel syndicate',
      'Commit to MVP deployment on Alliance campus within 90 days of selection'
    ],
    eligibility: 'Any enrolled Alliance University student team with at least 1 technical co-founder and 1 business co-founder.',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Business Modeling', 'Product Strategy', 'UI/UX Design', 'Financial Projections'],
    preferredSkills: ['Pitching', 'Market Research'],
    externalUrl: 'https://ecell.alliance.edu.in/pitch-2026',
    featured: false,
    totalApplicants: 78,
    openSpots: 12,
    contactEmail: 'ecell@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Business Modeling',
        resourceName: 'Y-Combinator Startup School: Market Sizing & Unit Economics',
        resourceType: 'Video Masterclass',
        url: 'https://startupschool.org',
        estimatedHours: 6
      }
    ]
  },
  {
    id: 'opp-5',
    title: 'Generative AI & LLM Systems Hands-on Masterclass',
    organizer: 'Alliance Developer Student Club & Google Cloud Campus',
    organizerType: 'Student Club',
    verified: true,
    category: 'Workshops',
    mode: 'Hybrid',
    location: 'Computer Lab 4 & YouTube Live Stream',
    department: 'Department of Computer Science & Engineering',
    deadline: '2026-11-10',
    eventDate: '2026-11-12 (Saturday 10:00 AM)',
    stipendOrPrize: 'Official Certificate + $100 Cloud Credits',
    description: 'Intensive full-day workshop on building production RAG pipelines, fine-tuning quantized open-weights models, and deploying low-latency agentic loops using modern TypeScript and Python SDKs.',
    responsibilities: [
      'Bring laptop with Docker and VS Code pre-installed',
      'Complete 3 guided coding assignments during the live lab sessions',
      'Deploy a working multi-agent assistant by end of day'
    ],
    eligibility: 'Open to all students with basic Python or JavaScript knowledge.',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Python', 'Machine Learning', 'API Development'],
    preferredSkills: ['Docker', 'PyTorch'],
    externalUrl: 'https://adsc.alliance.edu.in/workshops/genai',
    featured: false,
    totalApplicants: 290,
    openSpots: 100,
    contactEmail: 'dsc@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Machine Learning',
        resourceName: 'Vector Embeddings & Retrieval Fundamentals',
        resourceType: 'Documentation',
        url: 'https://huggingface.co/learn/nlp-course',
        estimatedHours: 4
      }
    ]
  },
  {
    id: 'opp-6',
    title: 'Inter-Collegiate Cyber Defense CTF Challenge',
    organizer: 'Alliance Cyber Security & Ethical Hacking Guild',
    organizerType: 'Student Club',
    verified: true,
    category: 'Technical Competitions',
    mode: 'Virtual',
    location: 'Alliance CTF CyberRange (Online)',
    department: 'Alliance College of Engineering & Design',
    deadline: '2026-11-22',
    eventDate: '2026-11-24 (24-Hour CTF)',
    stipendOrPrize: '₹1,00,000 + Bug Bounty Badges',
    description: 'Capture-the-flag competition covering binary exploitation, web security (OWASP Top 10), reverse engineering, cryptography, and digital forensics. Designed for novice to advanced ethical hackers.',
    responsibilities: [
      'Solve time-locked vulnerability puzzles across 5 security tracks',
      'Submit verifiable cryptographic flags to the automated scoreboard',
      'Comply with strict competitive ethics and non-interference rules'
    ],
    eligibility: 'All Alliance students. Individual or team registrations (up to 3 members).',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Linux', 'Network Security', 'Python', 'Cryptography'],
    preferredSkills: ['Web Security', 'Reverse Engineering'],
    externalUrl: 'https://ctf.alliance.edu.in',
    featured: false,
    totalApplicants: 95,
    openSpots: 60,
    contactEmail: 'cybersec@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Network Security',
        resourceName: 'OWASP Web Security Testing Guide & Burp Suite Basics',
        resourceType: 'Interactive Lab',
        url: 'https://portswigger.net/web-security',
        estimatedHours: 8
      }
    ]
  },
  {
    id: 'opp-7',
    title: 'Smart Campus IoT Sustainability Grant',
    organizer: 'Dean of Research & Sustainability Cell',
    organizerType: 'University Department',
    verified: true,
    category: 'Research',
    mode: 'In-Person',
    location: 'Green Energy Lab, Engineering Block B',
    department: 'Cross-Disciplinary',
    deadline: '2026-11-30',
    eventDate: 'Spring Semester 2027',
    stipendOrPrize: '₹1,50,000 Hardware Grant + Lab Access',
    description: 'Research grant to design and deploy real-time solar yield trackers, rainwater harvesting water-level telemetry, and smart cafeteria food-waste audit systems across the 55-acre campus.',
    responsibilities: [
      'Design low-power LoRaWAN sensor nodes with solar recharge capability',
      'Deploy live telemetry dashboard accessible by campus facilities teams',
      'Present mid-term progress report to the University Green Committee'
    ],
    eligibility: 'Interdisciplinary teams of 3 to 5 students containing members from both Engineering and Management/Design.',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['2nd Year', '3rd Year', '4th Year'],
    requiredSkills: ['Embedded Systems', 'IoT', 'Python', 'React'],
    preferredSkills: ['C++', 'UI/UX Design', 'PostgreSQL'],
    externalUrl: 'https://research.alliance.edu.in/green-grant',
    featured: false,
    totalApplicants: 44,
    openSpots: 3,
    contactEmail: 'sustainability@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'IoT',
        resourceName: 'LoRaWAN Sensor Design & MQTT Telemetry Pipelines',
        resourceType: 'Documentation',
        url: 'https://www.thethingsnetwork.org/docs/',
        estimatedHours: 7
      }
    ]
  },
  {
    id: 'opp-8',
    title: 'Alliance National Constitutional Law Moot Court',
    organizer: 'Alliance School of Law Moot Court Society',
    organizerType: 'Student Club',
    verified: true,
    category: 'University Events',
    mode: 'In-Person',
    location: 'Moot Court Hall, Alliance School of Law',
    department: 'Alliance School of Law',
    deadline: '2026-11-14',
    eventDate: '2026-12-10 — 2026-12-12',
    stipendOrPrize: '₹2,00,000 + Judicial Clerkship Recommendation',
    description: 'Prestigious national moot court competition arguing emerging constitutional issues surrounding AI copyright liability, algorithmic bias, and digital privacy jurisprudence.',
    responsibilities: [
      'Draft formal petitioner and respondent memorial submissions',
      'Argue before panels comprising sitting and retired High Court judges',
      'Demonstrate rigorous legal research and authoritative citation methodology'
    ],
    eligibility: 'Strictly restricted to students currently pursuing 3-Year or 5-Year LL.B. degrees at Alliance School of Law or recognized law faculties.',
    eligibleDepartments: ['Alliance School of Law'],
    eligibleYears: ['2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Legal Research', 'Oral Advocacy', 'Constitutional Law', 'Brief Writing'],
    preferredSkills: ['Intellectual Property Law'],
    externalUrl: 'https://law.alliance.edu.in/moot-2026',
    featured: false,
    totalApplicants: 62,
    openSpots: 24,
    contactEmail: 'mootcourt@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Legal Research',
        resourceName: 'SCC Online & Manupatra Advanced Search Techniques',
        resourceType: 'Documentation',
        url: 'https://www.scconline.com',
        estimatedHours: 4
      }
    ]
  },
  {
    id: 'opp-9',
    title: 'Cloud DevOps & Kubernetes Certification Cohort',
    organizer: 'Alliance Information Technology Services (AITS)',
    organizerType: 'University Department',
    verified: true,
    category: 'Certifications',
    mode: 'Hybrid',
    location: 'Cloud Learning Portal & Weekly Labs',
    department: 'Alliance College of Engineering & Design',
    deadline: '2026-11-28',
    eventDate: 'December 2026 (4-Week Intensive)',
    stipendOrPrize: '100% Exam Voucher Sponsor (CKA / AWS SAA)',
    description: 'Sponsored training cohort preparing 50 dedicated students for Certified Kubernetes Administrator (CKA) or AWS Certified Solutions Architect. Includes hands-on sandbox clusters and weekly instructor office hours.',
    responsibilities: [
      'Complete 8 container orchestration lab exercises in the AITS Kubernetes cluster',
      'Maintain 90% attendance across weekend live architecture deep dives',
      'Sit for official certification exam by January 15, 2027'
    ],
    eligibility: 'All 2nd, 3rd, and 4th year students with foundational Linux command-line literacy.',
    eligibleDepartments: ['Computer Science & Engineering', 'Alliance College of Engineering & Design'],
    eligibleYears: ['2nd Year', '3rd Year', '4th Year'],
    requiredSkills: ['Linux', 'Docker', 'Networking'],
    preferredSkills: ['Kubernetes', 'CI/CD Pipelines'],
    externalUrl: 'https://aits.alliance.edu.in/certs/k8s',
    featured: false,
    totalApplicants: 110,
    openSpots: 50,
    contactEmail: 'certifications@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Docker',
        resourceName: 'Docker Mastery: From Containers to Swarm & Compose',
        resourceType: 'Interactive Lab',
        url: 'https://docker-curriculum.com/',
        estimatedHours: 6
      }
    ]
  },
  {
    id: 'opp-10',
    title: 'UI/UX Design Sprint: Campus Services Redesign',
    organizer: 'Alliance Design Guild & Product Club',
    organizerType: 'Student Club',
    verified: true,
    category: 'Workshops',
    mode: 'In-Person',
    location: 'Design Studio Lab, School of Liberal Arts & Humanities',
    department: 'Cross-Disciplinary',
    deadline: '2026-11-16',
    eventDate: '2026-11-19 (3-Day Sprint)',
    stipendOrPrize: '₹50,000 + Production Implementation on Campus Portal',
    description: 'Collaborative 3-day product design sprint tackling actual student pain points: library book reservations, dining hall menus, and gym slots. Winning design system will be implemented directly into the official university portal.',
    responsibilities: [
      'Conduct user interviews with at least 15 fellow students and faculty members',
      'Build clickable, accessible Figma prototypes adhering to WCAG AA guidelines',
      'Document a complete tokenized design system component library'
    ],
    eligibility: 'Open to students of all years and majors. Beginners with enthusiasm are welcomed.',
    eligibleDepartments: ['All Departments'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems'],
    preferredSkills: ['Prototyping', 'Tailwind CSS'],
    externalUrl: 'https://design.alliance.edu.in/sprint-2026',
    featured: false,
    totalApplicants: 88,
    openSpots: 30,
    contactEmail: 'design-guild@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'UI/UX Design',
        resourceName: 'Refactoring UI: Practical UI Design Tactics',
        resourceType: 'Documentation',
        url: 'https://refactoringui.com',
        estimatedHours: 5
      }
    ]
  },
  {
    id: 'opp-11',
    title: 'Deep Learning for Medical Imaging Fellowship',
    organizer: 'Bio-Informatics Research Cell & Narayana Health Collaboration',
    organizerType: 'Research Lab',
    verified: true,
    category: 'Research',
    mode: 'Hybrid',
    location: 'Bio-AI Lab, Central Campus / Narayana Health City',
    department: 'Department of Computer Science & Engineering',
    deadline: '2026-12-01',
    eventDate: 'Spring Semester 2027',
    stipendOrPrize: '₹22,000 / month Fellowship',
    description: 'Develop transformer-based segmentation models for automated detection of early-stage diabetic retinopathy on multi-spectral retinal fundus scans in collaboration with clinical ophthalmologists.',
    responsibilities: [
      'Pre-process and augment clinical DICOM and TIFF retinal imagery',
      'Train vision transformers (ViT) and validate sensitivity/specificity metrics',
      'Prepare quarterly benchmark results for clinical audit boards'
    ],
    eligibility: 'Pre-final or postgraduate students with proven PyTorch proficiency and strong linear algebra/statistics background.',
    eligibleDepartments: ['Computer Science & Engineering', 'Biotechnology'],
    eligibleYears: ['3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Computer Vision'],
    preferredSkills: ['Medical Imaging', 'Docker', 'Linux'],
    externalUrl: 'https://bioai.alliance.edu.in/fellowship',
    featured: false,
    totalApplicants: 31,
    openSpots: 2,
    contactEmail: 'bioai@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'PyTorch',
        resourceName: 'PyTorch for Deep Learning & Vision Transformers',
        resourceType: 'Documentation',
        url: 'https://pytorch.org/tutorials/',
        estimatedHours: 8
      }
    ]
  },
  {
    id: 'opp-12',
    title: 'Product Management Fellowship: Campus EdTech',
    organizer: 'Alliance Digital Transformation Office',
    organizerType: 'University Department',
    verified: true,
    category: 'Internships',
    mode: 'In-Person',
    location: 'Vice Chancellor Office Wing, Central Campus',
    department: 'Alliance School of Business',
    deadline: '2026-11-21',
    eventDate: 'Dec 2026 — May 2027',
    stipendOrPrize: '₹20,000 / month + Leadership Certificate',
    description: 'Work closely with academic leadership to define roadmaps, write technical PRDs, and measure student engagement for digital classroom tools, exam schedules, and attendance automation.',
    responsibilities: [
      'Author PRDs with user stories, acceptance criteria, and metric definitions',
      'Run weekly sprint triage and feature roadmapping with student dev teams',
      'Track monthly active student usage and synthesize feedback survey findings'
    ],
    eligibility: 'BBA, MBA, or B.Tech 3rd/4th year students with demonstrated product thinking and analytical communication skills.',
    eligibleDepartments: ['Alliance School of Business', 'Computer Science & Engineering'],
    eligibleYears: ['3rd Year', '4th Year', 'Postgraduate'],
    requiredSkills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile/Scrum'],
    preferredSkills: ['UI/UX Design', 'SQL'],
    externalUrl: 'https://digital.alliance.edu.in/pm-fellows',
    featured: false,
    totalApplicants: 65,
    openSpots: 2,
    contactEmail: 'dto@alliance.edu.in',
    learningRoadmap: [
      {
        skill: 'Product Strategy',
        resourceName: 'Lenny\'s Product Management Playbook & PRD Templates',
        resourceType: 'Video Masterclass',
        url: 'https://www.lennysnewsletter.com',
        estimatedHours: 5
      }
    ]
  }
];

export const MOCK_STUDENTS: Student[] = [
  CURRENT_STUDENT,
  {
    id: 'student-2',
    name: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Alliance School of Business',
    degree: 'BBA in Marketing & FinTech',
    year: '3rd Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Venture & Product Strategy Lead',
    bio: 'Product strategist and venture enthusiast. Experience in user acquisition, market sizing, financial modeling, and pitching to seed-stage venture investors.',
    skills: ['Product Strategy', 'Business Modeling', 'User Research', 'Market Research', 'Financial Projections', 'Pitching'],
    interests: ['FinTech', 'Consumer Tech', 'Venture Capital', 'Product Management'],
    portfolioUrl: 'https://ananya-sharma.me',
    linkedinUrl: 'https://linkedin.com/in/ananya-sharma',
    experienceLevel: 'Intermediate',
    availabilityHoursPerWeek: 12,
    achievements: [
      'Winner — South India Youth Entrepreneurship Summit 2025',
      'Vice President — Alliance Entrepreneurship Cell (E-Cell)'
    ],
    experiences: [
      {
        id: 'exp-ananya-1',
        role: 'Venture Analyst Intern',
        companyOrLab: 'Blume Ventures Campus Scout Program',
        location: 'Bengaluru',
        period: 'Jun 2025 — Aug 2025',
        description: 'Screened 30+ university consumer tech applications and authored 4 investment memos for early seed investments.',
        skills: ['Market Research', 'Financial Projections']
      }
    ],
    projects: [
      {
        id: 'proj-ananya-1',
        title: 'MicroPay Campus Wallet',
        description: 'NFC-based student micro-payments pilot tested across 6 campus cafeteria kiosks.',
        techStack: ['Product Strategy', 'Market Research', 'Financial Projections'],
        role: 'Co-Founder & Product Lead'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-3',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Department of Computer Science & Engineering',
    degree: 'B.Tech in Computer Science',
    year: '4th Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Cloud Infrastructure & DevOps Engineer',
    bio: 'Systems engineer passionate about cloud infrastructure, Kubernetes microservices, distributed consensus, and Rust/Go backend performance.',
    skills: ['Docker', 'FastAPI', 'PostgreSQL', 'Linux', 'Kubernetes', 'Python', 'Go', 'Git'],
    interests: ['DevOps', 'Distributed Systems', 'Cloud Security', 'Open Source'],
    portfolioUrl: 'https://rohand.tech',
    githubUrl: 'https://github.com/rohandeshmukh',
    experienceLevel: 'Advanced',
    availabilityHoursPerWeek: 18,
    achievements: [
      'Certified Kubernetes Administrator (CKA)',
      'Google Summer of Code (GSoC) 2025 Contributor'
    ],
    experiences: [
      {
        id: 'exp-rohan-1',
        role: 'Platform Engineer Intern',
        companyOrLab: 'Postman Labs Bengaluru',
        location: 'Bengaluru',
        period: 'May 2025 — Jul 2025',
        description: 'Constructed automated Helm charts and Kubernetes deployment manifests for ephemeral developer test clusters.',
        skills: ['Kubernetes', 'Docker', 'Go', 'Linux']
      }
    ],
    projects: [
      {
        id: 'proj-rohan-1',
        title: 'KubeMesh Gateway',
        description: 'Lightweight sidecar proxy for microservice rate limiting and mTLS encryption in Kubernetes.',
        techStack: ['Go', 'Docker', 'Kubernetes', 'Linux'],
        role: 'Creator & Maintainer'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-4',
    name: 'Priyanka Nambiar',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Alliance School of Liberal Arts & Design',
    degree: 'B.Des in Interaction & Product Design',
    year: '3rd Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Lead Interaction & UI/UX Designer',
    bio: 'Product designer obsessed with micro-interactions, clean typography, WCAG accessibility, and translating complex technical flows into effortless interfaces.',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Tailwind CSS', 'Prototyping'],
    interests: ['Design Systems', 'Accessibility', 'Human-Computer Interaction', 'Spatial UI'],
    portfolioUrl: 'https://priyankanambiar.design',
    linkedinUrl: 'https://linkedin.com/in/priyanka-nambiar',
    experienceLevel: 'Advanced',
    availabilityHoursPerWeek: 15,
    achievements: [
      'Best Interface Design — HackBangalore 2025',
      'Lead Design Mentor — Alliance Design Guild'
    ],
    experiences: [
      {
        id: 'exp-priyanka-1',
        role: 'Design Engineering Fellow',
        companyOrLab: 'CRED Design Guild',
        location: 'Bengaluru',
        period: 'Jun 2025 — Aug 2025',
        description: 'Designed WCAG AA tactile payment card interactions and designed a localized token system for mobile checkout.',
        skills: ['Figma', 'UI/UX Design', 'Prototyping']
      }
    ],
    projects: [
      {
        id: 'proj-priyanka-1',
        title: 'Sanket: Accessible Indic Design System',
        description: 'Comprehensive tokenized UI kit optimized for multi-lingual Indian government and student web applications.',
        techStack: ['Figma', 'Design Systems', 'Tailwind CSS'],
        role: 'Design Architect'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-5',
    name: 'Karthik Subramanian',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Alliance College of Engineering & Design',
    degree: 'B.Tech in Aerospace Engineering',
    year: '3rd Year',
    campus: 'Anekal Campus, Bengaluru',
    suggestedRole: 'Autonomous Flight & SLAM Researcher',
    bio: 'Autonomous UAV robotics researcher with experience in ROS2 nodes, stereo vision depth estimation, and PX4 autopilot telemetry integration.',
    skills: ['Python', 'ROS2', 'Computer Vision', 'PyTorch', 'Linux', 'C++', 'Mathematics'],
    interests: ['Autonomous Flight', 'Robotics', 'Space Systems', 'Edge AI'],
    githubUrl: 'https://github.com/karthik-subraero',
    experienceLevel: 'Intermediate',
    availabilityHoursPerWeek: 14,
    achievements: [
      'Team Lead — Alliance AeroDesign SAE India (Rank 4 National)',
      'Author — Autonomous Collision Avoidance for Quadrotors in Confined Spaces'
    ],
    projects: [
      {
        id: 'proj-karthik-1',
        title: 'Vectra Autonomous Drone',
        description: 'Custom carbon-fiber quadrotor equipped with Jetson Orin Nano performing real-time obstacle avoidance.',
        techStack: ['ROS2', 'Python', 'C++', 'Computer Vision'],
        role: 'Flight Systems Lead'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-6',
    name: 'Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Department of Computer Science & Engineering',
    degree: 'B.Tech in Data Science',
    year: '2nd Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Data Scientist & Anomaly Analyst',
    bio: 'Data scientist enthusiastic about predictive analytics, statistical hypothesis testing, time-series forecasting, and interactive data visualization.',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'PostgreSQL', 'Git', 'FastAPI'],
    interests: ['Health Informatics', 'Algorithmic Trading', 'Data Storytelling'],
    portfolioUrl: 'https://meera-iyer.github.io',
    githubUrl: 'https://github.com/meera-iyer',
    experienceLevel: 'Intermediate',
    availabilityHoursPerWeek: 16,
    achievements: [
      'Top 5% Kaggle Competitor (Kaggle Expert)',
      'Data Analytics Head — Alliance Analytics Forum'
    ],
    projects: [
      {
        id: 'proj-meera-1',
        title: 'AirPulse Bengaluru',
        description: 'Hyper-local air particulate predictor using spatial interpolation and LSTM recurrent networks.',
        techStack: ['Python', 'Machine Learning', 'PostgreSQL'],
        role: 'Data Scientist'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-7',
    name: 'Aditya Verma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Department of Computer Science & Engineering',
    degree: 'B.Tech in CSE (Cyber Security)',
    year: '4th Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Cyber Security & Reverse Engineer',
    bio: 'Ethical hacker and vulnerability researcher. Active bug bounty hunter with reported CVEs in open-source enterprise access control software.',
    skills: ['Linux', 'Network Security', 'Python', 'Cryptography', 'Docker', 'Git'],
    interests: ['Binary Exploitation', 'Red Teaming', 'Zero-Trust Networks', 'Smart Contract Auditing'],
    githubUrl: 'https://github.com/aditya-infosec',
    experienceLevel: 'Advanced',
    availabilityHoursPerWeek: 15,
    achievements: [
      'Hall of Fame — 12 Fortune 500 Responsible Disclosure Programs',
      'Rank 1 — Karnataka State Police Cyber Security Hackathon'
    ],
    projects: [
      {
        id: 'proj-aditya-1',
        title: 'SentinelAudit CLI',
        description: 'Automated vulnerability scanner checking container base images for stale cryptographic dependencies.',
        techStack: ['Python', 'Linux', 'Docker', 'Network Security'],
        role: 'Security Engineer'
      }
    ],
    verifiedStudent: true
  },
  {
    id: 'student-8',
    name: 'Tanvi Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Alliance School of Law',
    degree: 'B.A. LL.B. (Hons)',
    year: '4th Year',
    campus: 'Central Campus, Bengaluru',
    suggestedRole: 'Legal & Technology Policy Researcher',
    bio: 'Legal researcher and moot court orator focusing on technology jurisprudence, algorithmic governance, cross-border privacy regimes, and intellectual property.',
    skills: ['Legal Research', 'Oral Advocacy', 'Constitutional Law', 'Brief Writing', 'Policy Analysis', 'Public Speaking'],
    interests: ['Tech Law', 'AI Ethics', 'IP Litigation', 'Corporate Arbitration'],
    linkedinUrl: 'https://linkedin.com/in/tanvi-kulkarni-law',
    experienceLevel: 'Advanced',
    availabilityHoursPerWeek: 12,
    achievements: [
      'Best Speaker — 14th National Human Rights Commission Moot Court',
      'Editor — Alliance Law Review Journal'
    ],
    projects: [
      {
        id: 'proj-tanvi-1',
        title: 'AI Authorship Policy Whitepaper',
        description: 'Comparative statutory analysis of copyright subsistence in model-generated software code across US, EU, and Indian legal frameworks.',
        techStack: ['Legal Research', 'Policy Analysis'],
        role: 'Lead Author'
      }
    ],
    verifiedStudent: true
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Team NeuroSync',
    projectTitle: 'Smart Campus Multimodal Assistant & Accessibility Suite',
    category: 'Hackathons',
    targetOpportunityId: 'opp-1',
    targetOpportunityTitle: 'Alliance National Innovation Hackathon 2026',
    description: 'We are engineering an ambient real-time vision and speech assistance app to assist visually impaired students navigate campus corridors, read physical notices, and transcribe lecture boards in real time.',
    leaderId: 'student-shrikrushn-01',
    leaderName: 'Shrikrushn Bhise',
    members: [
      {
        studentId: 'student-shrikrushn-01',
        name: 'Shrikrushn Bhise',
        role: 'Team Lead & AI Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        department: 'CSE - AI & ML'
      },
      {
        studentId: 'student-4',
        name: 'Priyanka Nambiar',
        role: 'Lead UI/UX & Interaction Designer',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
        department: 'B.Des Interaction Design'
      }
    ],
    openPositions: [
      {
        id: 'pos-1',
        title: 'Backend Systems & API Engineer',
        requiredSkills: ['FastAPI', 'PostgreSQL', 'Docker'],
        commitmentHours: 12,
        status: 'Open'
      },
      {
        id: 'pos-2',
        title: 'Edge Computer Vision Developer',
        requiredSkills: ['Computer Vision', 'PyTorch', 'Python'],
        commitmentHours: 10,
        status: 'Open'
      }
    ],
    requiredSkills: ['Python', 'PyTorch', 'React', 'FastAPI', 'UI/UX Design', 'Computer Vision'],
    createdDate: '2026-10-24',
    status: 'Recruiting'
  },
  {
    id: 'team-2',
    name: 'AeroGlide Autonomy Lab',
    projectTitle: 'Vision-Language-Action Indoor GPS-Denied Quadrotor',
    category: 'Research',
    targetOpportunityId: 'opp-2',
    targetOpportunityTitle: 'Autonomous Drone Navigation Research Fellow',
    description: 'Forming a high-caliber cross-disciplinary squad to tackle autonomous corridor mapping and semantic landing spot detection without relying on external GPS signals.',
    leaderId: 'student-5',
    leaderName: 'Karthik Subramanian',
    members: [
      {
        studentId: 'student-5',
        name: 'Karthik Subramanian',
        role: 'Lead Autonomy Researcher',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
        department: 'Aerospace Engineering'
      }
    ],
    openPositions: [
      {
        id: 'pos-3',
        title: 'Edge Vision & AI Systems Specialist',
        requiredSkills: ['PyTorch', 'Computer Vision', 'Python', 'Linux'],
        commitmentHours: 15,
        status: 'Open'
      }
    ],
    requiredSkills: ['ROS2', 'Computer Vision', 'Python', 'C++', 'PyTorch'],
    createdDate: '2026-10-26',
    status: 'Recruiting'
  },
  {
    id: 'team-3',
    name: 'FinPulse Venture Syndicate',
    projectTitle: 'Campus Ledger: Zero-Fee Peer-to-Peer Micro-Credit Network',
    category: 'Entrepreneurship',
    targetOpportunityId: 'opp-4',
    targetOpportunityTitle: 'Alliance Venture Studio Pitch Competition 2026',
    description: 'Pitching an authorized regulatory-compliant revolving credit and bill-splitting platform for university campuses, with automated risk scoring based on academic and attendance stability.',
    leaderId: 'student-2',
    leaderName: 'Ananya Sharma',
    members: [
      {
        studentId: 'student-2',
        name: 'Ananya Sharma',
        role: 'Founder & Business Lead',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
        department: 'School of Business'
      }
    ],
    openPositions: [
      {
        id: 'pos-4',
        title: 'Lead Full-Stack Web Engineer',
        requiredSkills: ['React', 'TypeScript', 'PostgreSQL', 'FastAPI'],
        commitmentHours: 12,
        status: 'Open'
      }
    ],
    requiredSkills: ['Business Modeling', 'Product Strategy', 'React', 'Financial Projections', 'FastAPI'],
    createdDate: '2026-10-28',
    status: 'Recruiting'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    opportunityTitle: 'Alliance National Innovation Hackathon 2026',
    organizer: 'Centre for Innovation & Incubation (CII)',
    category: 'Hackathons',
    appliedDate: '2026-10-26',
    deadline: '2026-11-20',
    status: 'Applied',
    notes: 'Submitted team proposal under Team NeuroSync. Proposal shortlisted for phase 1 architecture review.',
    externalLink: 'https://hackathon.alliance.edu.in',
    history: [
      { status: 'Saved', date: '2026-10-24', note: 'Bookmarked after seeing campus notice board' },
      { status: 'Applied', date: '2026-10-26', note: 'Uploaded 5-page system architecture draft' }
    ]
  },
  {
    id: 'app-2',
    opportunityId: 'opp-3',
    opportunityTitle: 'FinTech Platform Engineering Internship',
    organizer: 'Zerodha Technology Labs',
    category: 'Internships',
    appliedDate: '2026-10-22',
    deadline: '2026-11-25',
    status: 'Shortlisted',
    notes: 'Received round 1 online system design and concurrency test link. Scheduled for this Friday.',
    externalLink: 'https://careers.zerodha.com',
    history: [
      { status: 'Applied', date: '2026-10-22', note: 'Submitted via Alliance campus partner link' },
      { status: 'Shortlisted', date: '2026-10-29', note: 'Invited to 90-minute coding assessment' }
    ]
  },
  {
    id: 'app-3',
    opportunityId: 'opp-5',
    opportunityTitle: 'Generative AI & LLM Systems Hands-on Masterclass',
    organizer: 'Alliance Developer Student Club',
    category: 'Workshops',
    appliedDate: '2026-10-20',
    deadline: '2026-11-10',
    status: 'Selected',
    notes: 'Seat confirmed in Lab 4! Received Google Cloud $100 student credit voucher.',
    externalLink: 'https://adsc.alliance.edu.in',
    history: [
      { status: 'Applied', date: '2026-10-20' },
      { status: 'Selected', date: '2026-10-23', note: 'Voucher dispatched to student email' }
    ]
  },
  {
    id: 'app-4',
    opportunityId: 'opp-2',
    opportunityTitle: 'Autonomous Drone Navigation Research Fellow',
    organizer: 'Aerospace & Robotics Research Laboratory',
    category: 'Research',
    appliedDate: '2026-10-28',
    deadline: '2026-11-15',
    status: 'Saved',
    notes: 'Need to upload updated transcript and recommenders before final submission.',
    externalLink: 'https://aerolab.alliance.edu.in',
    history: [
      { status: 'Saved', date: '2026-10-28', note: 'Drafting statement of interest' }
    ]
  }
];

export const MOCK_INVITATIONS: TeamInvitation[] = [
  {
    id: 'inv-1',
    teamId: 'team-2',
    teamName: 'AeroGlide Autonomy Lab',
    projectTitle: 'Vision-Language-Action Indoor GPS-Denied Quadrotor',
    inviterId: 'student-5',
    inviterName: 'Karthik Subramanian',
    inviterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    inviteeId: 'student-shrikrushn-01',
    roleName: 'Edge Vision & AI Systems Specialist',
    date: '2026-10-31',
    status: 'Pending',
    message: 'Hey Shrikrushn! We saw your AuraCampus and PyTorch work. Would love to have your deep learning expertise on our quadrotor SLAM pipeline!'
  }
];

export const ALL_SKILLS_LIST: string[] = [
  'Python',
  'PyTorch',
  'React',
  'TypeScript',
  'FastAPI',
  'PostgreSQL',
  'Docker',
  'Tailwind CSS',
  'Machine Learning',
  'Git',
  'Linux',
  'ROS2',
  'Computer Vision',
  'C++',
  'Go',
  'Kubernetes',
  'UI/UX Design',
  'Figma',
  'User Research',
  'Design Systems',
  'Product Strategy',
  'Business Modeling',
  'Financial Projections',
  'Market Research',
  'Pitching',
  'Network Security',
  'Cryptography',
  'Embedded Systems',
  'IoT',
  'MATLAB/Simulink',
  'Legal Research',
  'Oral Advocacy',
  'Constitutional Law',
  'Brief Writing',
  'Policy Analysis',
  'Public Speaking',
  'Data Analysis'
];

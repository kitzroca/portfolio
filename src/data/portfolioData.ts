import { PortfolioData } from '../types/portfolio';

export const defaultMatrix: number[][] = Array.from({ length: 7 }, () => Array(53).fill(0));

export const initialPortfolioData: PortfolioData = {
  page_title: 'Kitz - Vibe Coder Portfolio',
  meta_description:
    'Personal portfolio and technical showcase of Kitz B. Roca, a Full-Stack Vibe Coder specializing in CodeIgniter 3, PHP, JavaScript, modern web architectures, and AI-driven applications.',

  user: {
    name: 'Kitz B. Roca',
    role: 'FULL-STACK VIBE CODER HAHAHA',
    avatar: '/images/profile.png',
    status: 'Available for hire',
    location: 'Burauen, Leyte, Philippines',
    tagline: 'Turning ideas into functional, modern, and efficient software through code, creativity, and AI.',
    resume_link: '/resume.pdf',
    copyright: `© ${new Date().getFullYear()} KITZ B. ROCA. ALL RIGHTS RESERVED.`,
  },

  nav_items: [
    { id: 'about', num: '01', label: 'ABOUT', bracket: '[01] ABOUT' },
    { id: 'projects', num: '02', label: 'PROJECTS', bracket: '[02] PROJECTS' },
    { id: 'stack', num: '03', label: 'STACK', bracket: '[03] STACK' },
    { id: 'vouch', num: '04', label: 'VOUCH', bracket: '[04] VOUCH' },
    { id: 'contact', num: '05', label: 'CONTACT', bracket: '[05] CONTACT' },
  ],

  social_links: [
    {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/kitzroca',
      aria: 'GitHub Profile',
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/kitzroca/',
      aria: 'Instagram Profile',
    },
    {
      name: 'Email',
      icon: 'mail',
      url: 'mailto:rocakitz914@gmail.com',
      aria: 'Send an Email',
    },
  ],

  about: {
    section_id: 'about',
    section_num: '01',
    section_header: '01 — BACKGROUND & BIO',
    nav_badge: 'ABOUT ME',
    bio_paragraphs: [
      'I am a full-stack vibe coder who enjoys turning ideas into working software. I build web applications, APIs, and user-friendly interfaces with a focus on clean and efficient code.',
      'I use modern technologies and AI tools to build projects faster, solve problems, and turn ideas into real applications.',
    ],
    stats: [
      {
        value: '...',
        label: 'COMMITS',
        has_link: true,
        link: 'https://github.com/kitzroca',
      },
      { value: 'Full', label: 'STACK VIBE CODER', has_link: false, link: '' },
      { value: 'BSIT', label: 'STUDENT', has_link: false, link: '' },
      { value: 'EVSU', label: 'STUDENT', has_link: false, link: '' },
    ],
    activity: {
      title: 'Activity Pulse',
      handle: '@kitzroca',
      handle_url: 'https://github.com/kitzroca',
      matrix: defaultMatrix,
      progress: 100,
      stats: [
        { key: 'RECENT', val: 'ACTIVE' },
        { key: 'TOTAL', val: 'SYNCING...' },
        { key: 'STATUS', val: 'CONTINUOUS SHIPPING' },
      ],
      commits_count: '...',
      is_loading: true,
      has_live_data: false,
    },
  },

  projects: {
    section_id: 'projects',
    section_num: '02',
    section_header: '02 — MY PROJECTS',
    nav_badge: 'FEATURED WORK',
    items: [
      {
        title: 'Developer Portfolio & Technical Showcase',
        period: '2025 – PRESENT',
        badge: 'Activity',
        description:
          'A high-performance personal developer portfolio and technical showcase featuring live GitHub contribution activity pulse, interactive terminal, clean aesthetics, and dynamic project highlights.',
        tech: ['React', 'TypeScript', 'Vite', 'CSS3', 'GitHub API'],
        stats: 'Live GitHub Sync · Developer Showcase',
        live_url: '#',
        github_url: 'https://github.com/kitzroca/portfolio',
      },
      {
        title: 'OFF GPT - Offline AI Assistant',
        period: '2025 – PRESENT',
        badge: 'Activity',
        description:
          'A private offline AI assistant designed to run AI models directly on Android devices without relying on cloud AI services.',
        tech: ['React', 'TypeScript', 'Capacitor', 'C++', 'GGUF', 'LiteRT-LM'],
        stats: '100% Offline · On-Device AI',
        live_url: '#',
        github_url: 'https://github.com/kitzroca',
      },
      {
        title: 'Authentication System',
        period: '2025 – PRESENT',
        badge: 'Activity',
        description:
          'A secure role-based authentication system with account protection, OTP verification, login monitoring, and access control.',
        tech: ['PHP', 'CodeIgniter 3', 'MySQL', 'JWT', 'OTP', 'RBAC'],
        stats: 'Secure Authentication · Role-Based Access',
        live_url: '#',
        github_url: 'https://github.com/kitzroca',
      },
      {
        title: 'Monitoring System',
        period: '2025 – PRESENT',
        badge: 'Activity',
        description:
          'A monitoring system for tracking system activity, user actions, and important events through a centralized interface.',
        tech: ['PHP', 'CodeIgniter 3', 'MySQL', 'JavaScript', 'AJAX'],
        stats: 'Real-Time Monitoring · Activity Tracking',
        live_url: '#',
        github_url: 'https://github.com/kitzroca',
      },
      {
        title: 'Grading System',
        period: '2023 – PRESENT',
        badge: 'Activity',
        description:
          'A student grading and academic records management system developed in Turbo C to calculate grades, handle student evaluations, and manage academic records.',
        tech: ['C', 'Turbo C', 'CLI', 'Data Structures', 'File Handling'],
        stats: 'Academic Computation · Record Management',
        live_url: '#',
        github_url: 'https://github.com/kitzroca',
      },
    ],
  },

  stack: {
    section_id: 'stack',
    section_num: '03',
    section_header: '03 — TECH STACK & TOOLS',
    nav_badge: 'TOOLKIT',
    categories: [
      {
        title: '01 — BACKEND & FRAMEWORKS',
        skills: [
          {
            name: 'PHP',
            icon: '/icons/php.svg',
            description: 'Server-side scripting & core backend engine',
          },
          {
            name: 'CodeIgniter 3',
            icon: '/icons/codeigniter.svg',
            description: 'Fast, lightweight PHP MVC framework',
          },
          {
            name: 'MVC',
            icon: '/icons/mvc.svg',
            description: 'Model-View-Controller architecture',
          },
          {
            name: 'OOP',
            icon: '/icons/oop.svg',
            description: 'Object-Oriented modular programming',
          },
          {
            name: 'AJAX',
            icon: '/icons/ajax.svg',
            description: 'Asynchronous server data exchange',
          },
        ],
      },
      {
        title: '02 — FRONTEND & UI',
        skills: [
          {
            name: 'HTML5',
            icon: '/icons/html5.svg',
            description: 'Semantic modern web document markup',
          },
          {
            name: 'CSS3',
            icon: '/icons/css3.svg',
            description: 'Responsive styling, Flexbox & Grid layouts',
          },
          {
            name: 'JavaScript',
            icon: '/icons/javascript.svg',
            description: 'Dynamic interactivity & ES6+ browser logic',
          },
          {
            name: 'TypeScript',
            icon: '/icons/typescript.svg',
            description: 'Strict type safety & scalable codebases',
          },
          {
            name: 'React',
            icon: '/icons/react.svg',
            description: 'Component-based reactive user interfaces',
          },

          {
            name: 'Bootstrap',
            icon: '/icons/bootstrap.svg',
            description: 'Responsive grid & utility styling framework',
          },
        ],
      },
      {
        title: '03 — DATABASE',
        skills: [
          {
            name: 'MySQL',
            icon: '/icons/mysql.svg',
            description: 'Relational database management system',
          },
          {
            name: 'MariaDB',
            icon: '/icons/mariadb.svg',
            description: 'High-performance open-source SQL RDBMS',
          },
          {
            name: 'Database Design',
            icon: '/icons/database-design.svg',
            description: 'Schema normalization & relational integrity',
          },
        ],
      },
      {
        title: '04 — MOBILE & AI',
        skills: [
          {
            name: 'Capacitor',
            icon: '/icons/capacitor.svg',
            description: 'Native web-to-mobile bridge runtime',
          },
          {
            name: 'Android',
            icon: '/icons/android.svg',
            description: 'Mobile operating system development & builds',
          },
          {
            name: 'Local AI',
            icon: '/icons/local-ai.svg',
            description: 'Private on-device inference without cloud APIs',
          },
          {
            name: 'LLMs',
            icon: '/icons/llm.svg',
            description: 'Large Language Models prompting & execution',
          },
          {
            name: 'GGUF',
            icon: '/icons/gguf.svg',
            description: 'Quantized neural network weight formats',
          },
          {
            name: 'AI-Assisted Coding',
            icon: '/icons/ai-coding.svg',
            description: 'Accelerated development with modern AI tools',
          },
        ],
      },
      {
        title: '05 — TOOLS',
        skills: [
          {
            name: 'GitHub',
            icon: '/icons/github.svg',
            description: 'Remote repository hosting, actions & reviews',
          },
          {
            name: 'Visual Studio Code',
            icon: '/icons/vscode.svg',
            description: 'Primary editor with modern tooling & debuggers',
          },
          {
            name: 'Laragon',
            icon: '/icons/laragon.svg',
            description: 'Isolated high-speed local dev environment',
          },
          {
            name: 'Turbo C',
            icon: '/icons/turboc.svg',
            description: 'Classic C/C++ IDE & compiler environment',
          },
        ],
      },
    ],
  },


  vouch: {
    section_id: 'vouch',
    section_num: '04',
    section_header: '04 — FEEDBACK',
    nav_badge: 'COLLABORATOR VOUCH',
    items: [],
  },

  contact: {
    section_id: 'contact',
    section_num: '05',
    section_header: '05 — GET IN TOUCH',
    nav_badge: 'CONTACT',
    headline: 'Interested in a Project or Collaboration Opportunity?',
    subtitle:
      'I am currently open for full-time positions, freelance contracts, and software consulting. Reach out directly and I will respond within 24 hours.',
    email: 'rocakitz914@gmail.com',
    channels: [
      {
        label: 'EMAIL',
        val: 'rocakitz914@gmail.com',
        action: 'mailto:rocakitz914@gmail.com',
        type: 'email',
      },
      {
        label: 'LOCATION',
        val: 'Burauen, Leyte, Philippines',
        action: '#',
        type: 'text',
      },
      {
        label: 'TIMEZONE',
        val: 'UTC+8 (PST / Asia/Manila)',
        action: '#',
        type: 'text',
      },
      {
        label: 'AVAILABILITY',
        val: 'Open to Full-Time Opportunities',
        action: '#',
        type: 'badge',
      },
    ],
  },
};

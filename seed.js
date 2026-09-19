require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/user.model');
const Hero = require('./models/hero.model');
const Social = require('./models/social.model');
const SkillType = require('./models/skillType.model');
const Skill = require('./models/skill.model');
const ProjectType = require('./models/projectType.model');
const Project = require('./models/project.model');
const Experience = require('./models/experience.model');
const Education = require('./models/education.model');

// ============================================================
// CREDENTIALS
// ============================================================
const EMAIL = 'ibrahimnoureldeen11@gmail.com';
const PASSWORD = 'Ibrahim@2025';
const USERNAME = 'Ibrahim Nour Eldeen';
// ============================================================

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.URL);
    console.log('✅ Connected to MongoDB');

    // 1. Clean Database
    console.log('🗑️  Deleting all existing users...');
    await User.deleteMany({});
    console.log('🧹 Clearing all previous collections...');
    await Hero.deleteMany({});
    await Social.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});

    // 2. Master Tables
    console.log('📊 Seeding Master Tables...');
    const skillTypesData = [
      { nameAr: 'مهارة تقنية', nameEn: 'Technical Skill', slug: 'tech' },
      { nameAr: 'مهارة شخصية', nameEn: 'Non-Technical Skill', slug: 'non-tech' }
    ];
    const skillTypesMap = {};
    for (const st of skillTypesData) {
      const type = await SkillType.findOneAndUpdate({ slug: st.slug }, st, { upsert: true, new: true });
      skillTypesMap[st.slug] = type._id;
    }

    const projectTypesData = [
      { nameAr: 'تطبيق ويب وموبايل', nameEn: 'Web & Mobile Application', slug: 'web-mobile-app' },
      { nameAr: 'تطبيق ويب', nameEn: 'Web Application', slug: 'web-app' },
      { nameAr: 'تطبيق موبايل', nameEn: 'Mobile Application', slug: 'mobile-app' },
      { nameAr: 'نظام مؤسسي Enterprise / ERP', nameEn: 'Enterprise / ERP System', slug: 'erp-system' },
      { nameAr: 'تطبيق متكامل Full Stack', nameEn: 'Full Stack Application', slug: 'full-stack' }
    ];
    const projectTypesMap = {};
    for (const pt of projectTypesData) {
      const type = await ProjectType.findOneAndUpdate({ slug: pt.slug }, pt, { upsert: true, new: true });
      projectTypesMap[pt.slug] = type._id;
    }

    // 3. User Creation (Full-Stack Engineer Persona)
    console.log('👤 Creating user...');
    const hashedPassword = await bcrypt.hash(PASSWORD, 8);
    const userId = new mongoose.Types.ObjectId();

    const refreshToken = jwt.sign(
      { username: USERNAME, email: EMAIL, role: 'admin', id: userId },
      process.env.REFRESH_SEKRET_KEY || 'secret',
      { expiresIn: '10d' }
    );

    const newUser = new User({
      _id: userId,
      username: USERNAME,
      email: EMAIL,
      password: hashedPassword,
      refreshToken,
      role: 'admin',
      avatar: 'uploads/avatar/img.jpg',
      CVFile: 'uploads/cv/user-1745607221986.pdf',
      info: {
        titleEn: "Ibrahim Nour Eldeen",
        titleAr: "إبراهيم نور الدين",
        subTitleEn: "Software Engineer | Full-Stack Developer",
        subTitleAr: "مهندس برمجيات | مطور Full-Stack",
        descriptionEn: "Passionate Software Engineer and Full-Stack Developer with extensive hands-on experience in building scalable web and mobile applications, ERP enterprise systems, and distributed RESTful APIs using React, Next.js, React Native, Node.js, Express, SQL Server, PostgreSQL, and MongoDB.",
        descriptionAr: "مهندس برمجيات ومطور Full-Stack شغوف بخبرة عملية متقدمة في بناء تطبيقات الويب والموبايل القابلة للتوسع، والأنظمة المؤسسية (ERP)، وواجهات برمجة التطبيقات (APIs) باستخدام React و Next.js و React Native و Node.js و SQL Server و PostgreSQL و MongoDB."
      }
    });
    await newUser.save();
    console.log('✅ User created successfully!');

    // 4. Hero Section
    console.log('🦸 Seeding Hero section...');
    await Hero.create({
      userId,
      titleEn: "Hi, I'm Ibrahim Nour Eldeen",
      titleAr: "مرحباً، أنا إبراهيم نور الدين",
      subTitleEn: "Software Engineer | Full-Stack Developer",
      subTitleAr: "مهندس برمجيات | مطور Full-Stack",
      descriptionEn: "Computer Science graduate and Full-Stack Software Engineer with proven experience designing and delivering robust web, mobile, and enterprise applications. Specializing in modern JavaScript/TypeScript ecosystems (React, Next.js, React Native, Node.js, Express) alongside both relational (SQL Server, PostgreSQL) and NoSQL (MongoDB) databases with strict adherence to Clean Architecture, performance optimization, and software engineering best practices.",
      descriptionAr: "خريج علوم حاسب ومهندس برمجيات Full-Stack بخبرة مثبتة في تصميم وتطوير تطبيقات الويب والموبايل والأنظمة المؤسسية. متخصص في بيئة عمل JavaScript/TypeScript الحديثة (React, Next.js, React Native, Node.js, Express) وقواعد البيانات العلائقية (SQL Server, PostgreSQL) وغير العلائقية (MongoDB) مع الالتزام بأعلى معايير الكود النظيف وأفضل الممارسات الهندسية."
    });

    // 5. Social & Contact
    console.log('🌐 Seeding Social & Contact links...');
    await Social.create({
      userId,
      phoneNumber: "(+20) 01011843602",
      email: "ibrahimnoureldeen11@gmail.com",
      linkedin: "https://www.linkedin.com/in/ibrahim-nour-eldeen/",
      github: "https://github.com/IbrahimNourEldeen",
      website: "https://ins-five-wheat.vercel.app",
      twitter: "",
      facebook: ""
    });

    // 6. Comprehensive Full-Stack Skills
    console.log('🛠️  Seeding Full-Stack Skills...');
    const technicalSkills = [
      { nameEn: "React.js & Next.js", nameAr: "رياكت ونكست جي إس", percent: 95, icon: "fa-react", color: "#61DAFB" },
      { nameEn: "React Native (Mobile)", nameAr: "رياكت نيتف (تطبيقات الموبايل)", percent: 85, icon: "fa-react", color: "#00D8FF" },
      { nameEn: "TypeScript & JavaScript", nameAr: "تايب سكريبت وجافاسكريبت", percent: 95, icon: "fa-js", color: "#3178C6" },
      { nameEn: "Node.js & Express.js", nameAr: "نود جي إس وإكسبريس", percent: 85, icon: "fa-node", color: "#339933" },
      { nameEn: "SQL Server (T-SQL, SPs)", nameAr: "إس كيو إل سيرفر (إجراءات مخزنة)", percent: 85, icon: "fa-database", color: "#CC2927" },
      { nameEn: "PostgreSQL", nameAr: "بوستجريس إس كيو إل", percent: 80, icon: "fa-database", color: "#4169E1" },
      { nameEn: "MongoDB & Mongoose", nameAr: "مونجو دي بي ومونجوس", percent: 85, icon: "fa-envira", color: "#47A248" },
      { nameEn: "Tailwind CSS & Radix UI", nameAr: "تيلويند سي إس إس ومكونات UI", percent: 95, icon: "fa-css3-alt", color: "#38B2AC" },
      { nameEn: "Redux Toolkit & TanStack Query", nameAr: "إدارة الحالة (Redux & React Query)", percent: 90, icon: "fa-react", color: "#764ABC" },
      { nameEn: "RESTful APIs & WebSockets", nameAr: "بناء وتكامل الـ APIs و WebSockets", percent: 90, icon: "fa-network-wired", color: "#009688" },
      { nameEn: "Git & GitHub", nameAr: "جيت وجيت هاب وإدارة الأكواد", percent: 90, icon: "fa-github", color: "#F05032" },
      { nameEn: "PHP & MySQL (PDO)", nameAr: "بي إتش بي وماي إس كيو إل", percent: 75, icon: "fa-php", color: "#777BB4" }
    ];

    for (let i = 0; i < technicalSkills.length; i++) {
      await Skill.create({
        ...technicalSkills[i],
        userId,
        typeId: skillTypesMap['tech'],
        order: i + 1
      });
    }

    const nonTechnicalSkills = [
      { nameEn: "Problem Solving & Analytical Thinking", nameAr: "حل المشكلات والتفكير التحليلي", percent: 95, icon: "fa-lightbulb", color: "#FFC107" },
      { nameEn: "Team Leadership & Collaboration", nameAr: "العمل الجماعي والقيادة التعاونية", percent: 95, icon: "fa-users", color: "#2196F3" },
      { nameEn: "Effective Communication", nameAr: "التواصل الفعال وعرض الحلول التقنية", percent: 90, icon: "fa-comments", color: "#4CAF50" },
      { nameEn: "Agile & Scrum Methodologies", nameAr: "العمل بمنهجية Agile و Scrum", percent: 95, icon: "fa-sync-alt", color: "#9C27B0" },
      { nameEn: "Time Management & Fast Learning", nameAr: "إدارة الوقت وسرعة التعلم الذاتي", percent: 90, icon: "fa-clock", color: "#FF9800" }
    ];

    for (let i = 0; i < nonTechnicalSkills.length; i++) {
      await Skill.create({
        ...nonTechnicalSkills[i],
        userId,
        typeId: skillTypesMap['non-tech'],
        order: i + 1
      });
    }

    // 7. Work Experiences
    console.log('💼 Seeding Experiences...');
    await Experience.create([
      {
        userId,
        positionEn: "Software Engineer",
        positionAr: "مهندس برمجيات",
        company: "ERP Software Company (Mass Software)",
        companyLogo: "",
        location: "El Obour, Egypt",
        durationFrom: "Sept 2025",
        durationTo: "Present",
        responsibilitiesEn: [
          "Architect and maintain core enterprise ERP system modules, invoices, workflows, and operations management.",
          "Write complex SQL Server queries, optimized stored procedures, triggers, views, and database functions.",
          "Develop dynamic frontend and full-stack modules using modern JavaScript, React.js, TypeScript, and Redux Toolkit.",
          "Integrate enterprise interfaces with backend RESTful services and robust transaction handling.",
          "Collaborate with business analysts and engineers in Agile sprints to deliver mission-critical software solutions."
        ],
        responsibilitiesAr: [
          "تطوير وصيانة وحدات أنظمة تخطيط موارد المؤسسات (ERP)، الفواتير، وسير العمليات وإدارة البيانات المركزية.",
          "كتابة استعلامات SQL Server متقدمة، وبناء الإجراءات المخزنة (Stored Procedures)، والـ Functions لتحسين سرعة معالجة البيانات.",
          "بناء وتطوير واجهات المستخدم والوحدات التفاعلية باستخدام JavaScript و React.js و TypeScript و Redux Toolkit.",
          "ربط الواجهات البرمجية وتكامل الـ RESTful APIs مع تطبيق أعلى معايير الأمان وإدارة الجلسات.",
          "التعاون في دورات العمل السريعة (Agile Sprints) لتقديم حلول تقنية عالية الكفاءة تلبي متطلبات الأعمال."
        ],
        order: 1
      },
      {
        userId,
        positionEn: "Front-End Developer (Core Team Member)",
        positionAr: "مطور واجهات أمامية (عضو الفريق الأساسي)",
        company: "Google Developer Student Clubs (GDSC) — Benha University",
        companyLogo: "",
        location: "Benha, Egypt",
        durationFrom: "Sept 2023",
        durationTo: "Oct 2024",
        responsibilitiesEn: [
          "Developed responsive and interactive web applications utilizing HTML5, CSS3, JavaScript (ES6+), and Bootstrap.",
          "Collaborated within cross-functional developer teams, organizing technical workshops and delivering community software projects.",
          "Ensured cross-browser compatibility and optimized web performance across diverse devices."
        ],
        responsibilitiesAr: [
          "تطوير تطبيقات ومكونات ويب متجاوبة وتفاعلية باستخدام HTML5 و CSS3 و JavaScript الحديثة و Bootstrap.",
          "العمل التعاوني ضمن فرق التطوير في النادي الطلابي، والمشاركة في ورش العمل البرمجية وإنجاز المشاريع التقنية.",
          "ضمان توافقية الواجهات مع كافة المتصفحات وتحسين سرعة الاستجابة على الشاشات المختلفة."
        ],
        order: 2
      },
      {
        userId,
        positionEn: "Full Stack Web Developer Trainee",
        positionAr: "متدرب تطوير ويب متكامل (Full Stack)",
        company: "Digital Egypt Pioneers Initiative (DEPI) – MCIT",
        companyLogo: "",
        location: "Egypt",
        durationFrom: "July 2024",
        durationTo: "Oct 2024",
        responsibilitiesEn: [
          "Completed intensive professional training in Full Stack web development covering React.js, Node.js, Express, and MongoDB.",
          "Built real-world scalable full-stack applications with state management, JWT authentication, and REST APIs.",
          "Graduated the track with distinction, demonstrating high software quality and collaborative teamwork."
        ],
        responsibilitiesAr: [
          "إتمام برنامج تدريبي احترافي مكثف في تطوير الويب الكامل (Full Stack) يغطي React.js و Node.js و Express و MongoDB.",
          "بناء مشاريع عملية متكاملة مع إدارة الحالة والمصادقة الآمنة وتصميم الـ REST APIs.",
          "التخرج من المسار بتقدير امتياز مع تطبيق أفضل ممارسات هندسة البرمجيات."
        ],
        order: 3
      }
    ]);

    // 8. Education & Credentials
    console.log('🎓 Seeding Education...');
    await Education.create([
      {
        userId,
        titleEn: "Bachelor of Science in Computer Science",
        titleAr: "بكالوريوس العلوم في علوم الحاسب",
        subTitleEn: "Faculty of Science, Benha University",
        subTitleAr: "كلية العلوم، جامعة بنها",
        durationFrom: "2022",
        durationTo: "2026",
        details: [
          { labelEn: "GPA", labelAr: "المعدل التراكمي", value: "3.60 / 4.00" },
          { labelEn: "Graduation Grade", labelAr: "التقدير العام", value: "Very Good with Honors (جيد جداً مع مرتبة الشرف)" },
          { labelEn: "Graduation Project", labelAr: "مشروع التخرج", value: "UniDent Care (Excellent with Honors - امتياز مع مرتبة الشرف)" }
        ],
        order: 1
      },
      {
        userId,
        titleEn: "Full Stack Web Developer Specialization",
        titleAr: "شهادة تخصص تطوير الويب Full Stack",
        subTitleEn: "Digital Egypt Pioneers Initiative (DEPI) – MCIT",
        subTitleAr: "مبادرة رواد مصر الرقمية (DEPI) – وزارة الاتصالات وتكنولوجيا المعلومات",
        durationFrom: "July 2024",
        durationTo: "Oct 2024",
        details: [
          { labelEn: "Track", labelAr: "المسار", value: "Full Stack Web Development Track" },
          { labelEn: "Credential", labelAr: "الشهادة", value: "Professional Certification" },
          { labelEn: "Status", labelAr: "الحالة", value: "Completed with Excellence" }
        ],
        order: 2
      }
    ]);

    // 9. Featured Full-Stack Projects
    console.log('🚀 Seeding Projects...');
    await Project.create([
      {
        userId,
        typeId: projectTypesMap['web-mobile-app'],
        titleEn: "UniDent Care — Dental Healthcare Digital Ecosystem (Graduation Project)",
        titleAr: "يوني دينت كير — المنظومة الرقمية للرعاية الصحية لطب الأسنان (مشروع التخرج)",
        descriptionEn: "A comprehensive digital ecosystem designed for dental healthcare management and clinical training at Benha University. Engineered the entire cross-platform Mobile Application solo using React Native, and co-engineered the Web Platform with the graduation team using Next.js 16 and React 19. Features Role-Based Access Control (RBAC) across 4 roles (Doctor, Student, Patient, Clinical Supervisor), interactive dental odontogram charting, appointment calendar integration (FullCalendar), analytics dashboards (Recharts), and real-time state synchronization.",
        descriptionAr: "منظومة رقمية شاملة لإدارة الرعاية الصحية والتدريب السريري لطب الأسنان بجامعة بنها. تم تطوير تطبيق الموبايل بالكامل بشكل فردي (Solo) باستخدام React Native، وتطوير منصة الويب بالتعاون مع فريق مشروع التخرج باستخدام Next.js 16 و React 19. تتضمن المنظومة صلاحيات متعددة الأدوار (RBAC) لـ 4 أدوار، مخطط أسنان تفاعلي (Odontogram)، تقويم مواعيد ذكي، ولوحات تحكم بيانية وتحليلية متقدمة.",
        technologies: ["React Native", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Redux Toolkit", "TanStack Query", "Radix UI", "Framer Motion", "Recharts", "FullCalendar", "REST API", ".NET API"],
        githubRepo: "https://github.com/IbrahimNourEldeen/UniDent-Care-Mobile-App",
        liveDemo: "",
        poster: []
      },
      {
        userId,
        typeId: projectTypesMap['erp-system'],
        titleEn: "Enterprise ERP System",
        titleAr: "نظام إدارة الموارد المؤسسية (ERP System)",
        descriptionEn: "A comprehensive Enterprise Resource Planning (ERP) platform developed to streamline core business operations, sales pipelines, product catalogs, invoice lifecycles, and automated financial workflows. Built with robust backend architecture utilizing SQL Server, complex Stored Procedures, Functions, database transactions, and a reactive frontend dashboard interface.",
        descriptionAr: "نظام متكامل لتخطيط وإدارة موارد المؤسسات (ERP) تم بناؤه لتنظيم وأتمتة العمليات التشغيلية، إدارة المنتجات، المبيعات، الفواتير، وسير العمل المالي. تم بناؤه بهيكلية برمجية قوية تعتمد على SQL Server والإجراءات المخزنة (Stored Procedures) والمعاملات البنكية/المحاسبية، مع واجهة أمامية تفاعلية ودقيقة.",
        technologies: ["JavaScript", "SQL Server (T-SQL)", "Stored Procedures", "Functions", "Node.js", "Express.js", "REST API", "Tailwind CSS"],
        githubRepo: "https://github.com/IbrahimNourEldeen",
        liveDemo: "",
        poster: []
      },
      {
        userId,
        typeId: projectTypesMap['full-stack'],
        titleEn: "Task Master — Task Management Platform",
        titleAr: "تاسك ماستر — منصة إدارة وتوزيع المهام",
        descriptionEn: "A modern full-stack task management platform allowing teams to organize and manage daily operations. Features real-time task creation, team member delegation, progress tracking, dynamic dashboard analytics, and secure JWT-authenticated user routing.",
        descriptionAr: "منصة Full-Stack حديثة لإدارة المهام تتيح لفرق العمل تنظيم ومتابعة العمليات اليومية. تدعم إنشاء وتعيين المهام، متابعة نسب الإنجاز، لوحات تحكم تحليلية ديناميكية، وتوجيه آمن للمستخدمين عبر JWT.",
        technologies: ["React.js", "Redux Toolkit", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "REST API", "Tailwind CSS"],
        githubRepo: "https://github.com/IbrahimNourEldeen/Task-Management-SystemFrontEnd",
        liveDemo: "",
        poster: []
      },
      {
        userId,
        typeId: projectTypesMap['full-stack'],
        titleEn: "Awfar Shop — E-Commerce Platform",
        titleAr: "أوفر شوب — منصة تجارة إلكترونية متكاملة",
        descriptionEn: "A full-featured e-commerce solution with dynamic product catalogs, interactive cart management, order checkout workflows, and a comprehensive Admin Panel to manage products, categories, stock, and live customer orders.",
        descriptionAr: "منصة تجارة إلكترونية متكاملة توفر تصفح المنتجات وسلة مشتريات تفاعلية ونظام إتمام الطلبات، مع لوحة تحكم إدارية كاملة للمشرف لإدارة المنتجات والأقسام والمخزون ومتابعة طلبات العملاء وحالات التوصيل.",
        technologies: ["React.js", "Redux Toolkit", "Bootstrap", "PHP (PDO)", "MySQL", "JWT", "REST API"],
        githubRepo: "https://github.com/IbrahimNourEldeen/Front-End-Awfar-Shop-react.js",
        liveDemo: "",
        poster: []
      },
      {
        userId,
        typeId: projectTypesMap['full-stack'],
        titleEn: "Personal Portfolio Platform",
        titleAr: "الموقع الشخصي والبورتفوليو الحديث",
        descriptionEn: "An interactive, animated personal developer portfolio showcasing skills, experience, projects, and education with full bilingual support (Arabic & English), dark/light theme switching, and modular backend API integration.",
        descriptionAr: "منصة بورتفوليو شخصية متطورة وتفاعلية لعرض المهارات والخبرات والمشاريع والمسار الأكاديمي مع دعم كامل للغتين العربية والإنجليزية وتغيير المظهر (فاتح/داكن) والربط مع Backend حديث ومقسّم باحترافية.",
        technologies: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Node.js", "Express.js", "MongoDB", "REST API"],
        githubRepo: "https://github.com/IbrahimNourEldeen/my-portfolio",
        liveDemo: "https://ins-five-wheat.vercel.app",
        poster: []
      }
    ]);

    console.log('🎉 ============================================================');
    console.log('✅ Full-Stack database successfully seeded!');
    console.log('📋 User ID:', userId.toString());
    console.log('📧 Email:', EMAIL);
    console.log('🔑 Password:', PASSWORD);
    console.log('🚀 Projects: UniDent Care (Web & Mobile Solo), ERP System, Task Master, Awfar Shop, Portfolio');
    console.log('============================================================');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

export const DEFAULT_MOCK_DATA = {
  site_settings: {
    id: true,
    site_name: 'Alex Morgan | Portfolio CMS',
    contact_email: 'contact@alexmorgan.dev',
    phone: '+1 (555) 019-2834',
    meta_title: {
      en: 'Alex Morgan | Senior Creative Developer & Designer',
      ar: 'أليكس مورجان | مطور ومصمم إبداعي أول'
    },
    meta_description: {
      en: 'Senior Creative Developer specialized in building polished user interfaces, performance optimization, and custom web applications.',
      ar: 'مطور إبداعي أول متخصص في بناء واجهات مستخدم مصقولة، وتحسين الأداء، وتطبيقات الويب المخصصة.'
    },
    keywords: {
      en: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'CMS', 'Portfolio'],
      ar: ['رياكت', 'نيكست جي إس', 'تايب سكريبت', 'تيلويند سي إس إس', 'نظام إدارة المحتوى', 'معرض الأعمال']
    },
    location: {
      en: 'San Francisco, CA',
      ar: 'سان فرانسيسكو، كاليفورنيا'
    },
    footer_text: {
      en: '© 2026 Alex Morgan. Built with Next.js & Supabase.',
      ar: '© 2026 أليكس مورجان. تم البناء بواسطة نيكست جي إس وسوبابيس.'
    },
    sections_order: ['hero', 'about', 'skills', 'experience', 'projects', 'services', 'testimonials', 'certifications', 'contact'],
    sections_visibility: {
      hero: true,
      about: true,
      skills: true,
      experience: true,
      projects: true,
      services: true,
      testimonials: true,
      certifications: true,
      contact: true
    },
    updated_at: new Date().toISOString()
  },
  hero: {
    id: true,
    name: { en: 'Alex Morgan', ar: 'أليكس مورجان' },
    title: { en: 'Senior Creative Developer & UI Architect', ar: 'مطور إبداعي أول ومهندس واجهات' },
    subtitle: { 
      en: 'Handcrafting immersive web experiences that merge storytelling with robust production-ready code.', 
      ar: 'صياغة تجارب ويب غامرة تدمج سرد القصص مع برمجيات قوية جاهزة للإنتاج.' 
    },
    cta_text: { en: 'View Projects', ar: 'عرض المشاريع' },
    cta_link: '#projects',
    cta_text_secondary: { en: 'Get in Touch', ar: 'تواصل معي' },
    cta_link_secondary: '#contact',
    background_animation: 'particles',
    visible: true,
    updated_at: new Date().toISOString()
  },
  about: {
    id: true,
    biography: {
      en: 'I am a design-driven software engineer with 8+ years of experience crafting beautiful, highly interactive applications. I bridge the gap between complex engineering architectures and visual design systems. My focus is on writing clean, modular code that runs with 60fps animations.',
      ar: 'أنا مهندس برمجيات مهتم بالتصميم لدي أكثر من 8 سنوات من الخبرة في صياغة تطبيقات جميلة وتفاعلية للغاية. أقوم بسد الفجوة بين هندسة البرمجيات المعقدة وأنظمة التصميم المرئي. ينصب تركيزي على كتابة أكواد برمجية نظيفة وقابلة لإعادة الاستخدام تعمل برسوم متحركة سلسة للغاية.'
    },
    skills_summary: {
      en: 'Experienced across full stack React, Next.js, Node, Golang, PostgreSQL, and scalable cloud architectures. Passionate about design tokens, page performance, and screen reader accessibility.',
      ar: 'خبرة واسعة في العمل مع رياكت، نيكست جي إس، نود، جو لانج، بوستجرس، وبنى سحابية قابلة للتطوير. شغوف برؤوس التصميم، وأداء صفحات الويب، وإمكانية الوصول لقارئات الشاشة.'
    },
    cv_url: '#',
    profile_image_url: '',
    updated_at: new Date().toISOString()
  },
  translations: [
    { key: 'nav_home', en: 'Home', ar: 'الرئيسية' },
    { key: 'nav_about', en: 'About', ar: 'من أنا' },
    { key: 'nav_skills', en: 'Skills', ar: 'المهارات' },
    { key: 'nav_experience', en: 'Experience', ar: 'الخبرة' },
    { key: 'nav_projects', en: 'Projects', ar: 'المشاريع' },
    { key: 'nav_services', en: 'Services', ar: 'الخدمات' },
    { key: 'nav_testimonials', en: 'Testimonials', ar: 'الآراء' },
    { key: 'nav_certifications', en: 'Certifications', ar: 'الشهادات' },
    { key: 'nav_contact', en: 'Contact', ar: 'اتصل بي' },
    { key: 'skills_title', en: 'Skills & Expertise', ar: 'المهارات والخبرات' },
    { key: 'skills_subtitle', en: 'Categorized overview of my technical stack and proficiency levels', ar: 'نظرة عامة مصنفة على تقنياتي ومستويات كفاءتي' },
    { key: 'experience_title', en: 'Work History', ar: 'الخبرة المهنية' },
    { key: 'experience_subtitle', en: 'Timeline of my professional journey in software engineering', ar: 'مسار رحلتي المهنية في هندسة البرمجيات' },
    { key: 'projects_title', en: 'Featured Projects', ar: 'المشاريع المميزة' },
    { key: 'projects_subtitle', en: 'A selection of products I have architected and delivered recently', ar: 'مجموعة مختارة من المنتجات التي قمت ببنائها وتسليمها مؤخراً' },
    { key: 'services_title', en: 'Services Offered', ar: 'الخدمات المقدمة' },
    { key: 'services_subtitle', en: 'How I can help bring your ideas and digital designs to life', ar: 'كيف يمكنني المساعدة في إحياء أفكارك وتصاميمك الرقمية' },
    { key: 'testimonials_title', en: 'Client Recommendations', ar: 'آراء وتوصيات العملاء' },
    { key: 'testimonials_subtitle', en: 'Kind words from colleagues, clients, and engineering leaders', ar: 'كلمات لطيفة من الزملاء والعملاء وقادة الهندسة البرمجية' },
    { key: 'certifications_title', en: 'Licenses & Certifications', ar: 'الشهادات والتراخيص' },
    { key: 'certifications_subtitle', en: 'Professional credentials and continuous learning verification', ar: 'الاعتمادات المهنية والتحقق من التعلم المستمر' },
    { key: 'contact_title', en: "Let's Create Together", ar: 'دعنا نعمل معاً' },
    { key: 'contact_subtitle', en: 'Send a message to discuss your project or job opportunities', ar: 'أرسل رسالة لمناقشة مشروعك أو الفرص الوظيفية المتاحة' },
    { key: 'contact_name', en: 'Full Name', ar: 'الاسم الكامل' },
    { key: 'contact_email', en: 'Email Address', ar: 'البريد الإلكتروني' },
    { key: 'contact_phone', en: 'Phone Number', ar: 'رقم الهاتف' },
    { key: 'contact_subject', en: 'Subject', ar: 'الموضوع' },
    { key: 'contact_message', en: 'Message', ar: 'الرسالة' },
    { key: 'contact_submit', en: 'Send Message', ar: 'إرسال الرسالة' },
    { key: 'contact_sending', en: 'Sending...', ar: 'جاري الإرسال...' },
    { key: 'contact_success', en: 'Thank you! Your message has been saved and sent successfully.', ar: 'شكراً لك! تم حفظ وإرسال رسالتك بنجاح.' },
    { key: 'cv_download', en: 'Download Resume / CV', ar: 'تحميل السيرة الذاتية' },
    { key: 'read_more', en: 'Read More', ar: 'اقرأ المزيد' },
    { key: 'view_project', en: 'View Project Details', ar: 'عرض تفاصيل المشروع' },
    { key: 'github_repo', en: 'GitHub Repository', ar: 'مستودع جيت هاب' },
    { key: 'live_demo', en: 'Live Demo', ar: 'العرض المباشر' },
    { key: 'admin_login', en: 'Admin Access Portal', ar: 'بوابة دخول المشرف' },
    { key: 'admin_dashboard', en: 'Dashboard Home', ar: 'الرئيسية لوحة التحكم' },
    { key: 'status_draft', en: 'Draft', ar: 'مسودة' },
    { key: 'status_inprogress', en: 'In Progress', ar: 'قيد العمل' },
    { key: 'status_completed', en: 'Completed', ar: 'مكتمل' },
    { key: 'client_label', en: 'Client', ar: 'العميل' },
    { key: 'date_label', en: 'Completion Date', ar: 'تاريخ الإنجاز' },
    { key: 'category_label', en: 'Category', ar: 'الفئة' },
    { key: 'all_categories', en: 'All Projects', ar: 'كل المشاريع' }
  ],
  navigation: [
    { id: 'n1', label: { en: 'Home', ar: 'الرئيسية' }, path: '#hero', sort_order: 1, visible: true },
    { id: 'n2', label: { en: 'About', ar: 'من أنا' }, path: '#about', sort_order: 2, visible: true },
    { id: 'n3', label: { en: 'Skills', ar: 'المهارات' }, path: '#skills', sort_order: 3, visible: true },
    { id: 'n4', label: { en: 'Experience', ar: 'الخبرة' }, path: '#experience', sort_order: 4, visible: true },
    { id: 'n5', label: { en: 'Projects', ar: 'المشاريع' }, path: '#projects', sort_order: 5, visible: true },
    { id: 'n6', label: { en: 'Services', ar: 'الخدمات' }, path: '#services', sort_order: 6, visible: true },
    { id: 'n7', label: { en: 'Testimonials', ar: 'الآراء' }, path: '#testimonials', sort_order: 7, visible: true },
    { id: 'n8', label: { en: 'Certifications', ar: 'الشهادات' }, path: '#certifications', sort_order: 8, visible: true },
    { id: 'n9', label: { en: 'Contact', ar: 'اتصل بي' }, path: '#contact', sort_order: 9, visible: true }
  ],
  social_links: [
    { id: 's1', platform: 'GitHub', url: 'https://github.com', icon: 'github', sort_order: 1 },
    { id: 's2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', sort_order: 2 },
    { id: 's3', platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter', sort_order: 3 }
  ],
  skill_categories: [
    { id: 'c1a84f33-1000-4b2e-a579-24751f211eb1', name: { en: 'Frontend Engineering', ar: 'هندسة الواجهات الأمامية' }, sort_order: 1 },
    { id: 'c1a84f33-2000-4b2e-a579-24751f211eb2', name: { en: 'Backend & Databases', ar: 'الخلفية وقواعد البيانات' }, sort_order: 2 },
    { id: 'c1a84f33-3000-4b2e-a579-24751f211eb3', name: { en: 'Cloud & DevOps', ar: 'الحوسبة السحابية والعمليات' }, sort_order: 3 }
  ],
  skills: [
    { id: 'sk1', category_id: 'c1a84f33-1000-4b2e-a579-24751f211eb1', name: 'React / Next.js (App Router)', icon: 'react', proficiency: 95, sort_order: 1 },
    { id: 'sk2', category_id: 'c1a84f33-1000-4b2e-a579-24751f211eb1', name: 'TypeScript & ESNext', icon: 'code-2', proficiency: 90, sort_order: 2 },
    { id: 'sk3', category_id: 'c1a84f33-1000-4b2e-a579-24751f211eb1', name: 'Tailwind CSS & Framer Motion', icon: 'paint-brush', proficiency: 92, sort_order: 3 },
    { id: 'sk4', category_id: 'c1a84f33-2000-4b2e-a579-24751f211eb2', name: 'Node.js / Next Server Actions', icon: 'server', proficiency: 88, sort_order: 1 },
    { id: 'sk5', category_id: 'c1a84f33-2000-4b2e-a579-24751f211eb2', name: 'PostgreSQL & Supabase API', icon: 'database', proficiency: 85, sort_order: 2 },
    { id: 'sk6', category_id: 'c1a84f33-2000-4b2e-a579-24751f211eb2', name: 'Redis Caching & REST/GraphQL APIs', icon: 'cpu', proficiency: 80, sort_order: 3 },
    { id: 'sk7', category_id: 'c1a84f33-3000-4b2e-a579-24751f211eb3', name: 'Vercel & AWS Deployments', icon: 'cloud', proficiency: 82, sort_order: 1 },
    { id: 'sk8', category_id: 'c1a84f33-3000-4b2e-a579-24751f211eb3', name: 'Git, GitHub Actions & CI/CD', icon: 'git-branch', proficiency: 86, sort_order: 2 },
    { id: 'sk9', category_id: 'c1a84f33-3000-4b2e-a579-24751f211eb3', name: 'Docker & Containerization', icon: 'container', proficiency: 70, sort_order: 3 }
  ],
  experience: [
    {
      id: 'e1',
      company: 'Innovate Tech Labs',
      position: { en: 'Lead UI Engineer', ar: 'مهندس واجهات قيادي' },
      start_date: '2024-01-15',
      end_date: null,
      current: true,
      description: {
        en: 'Leading the frontend transition to Next.js App router, improving Core Web Vitals LCP by 45%. Established custom visual token themes and mentored junior React devs.',
        ar: 'قيادة انتقال الواجهات الأمامية إلى نيكست جي إس، وتحسين مؤشرات أداء الويب بنسبة 45%. إنشاء رموز أنماط مخصصة وتدريب المطورين الجدد.'
      },
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      sort_order: 1
    },
    {
      id: 'e2',
      company: 'Alpha Solutions Corp',
      position: { en: 'Software Engineer II', ar: 'مهندس برمجيات ثاني' },
      start_date: '2021-06-01',
      end_date: '2023-12-31',
      current: false,
      description: {
        en: 'Architected full stack features utilizing Node.js microservices and PostgreSQL. Integrated Stripe billing systems and managed automated Jest validation workflows.',
        ar: 'بناء ميزات شاملة باستخدام خدمات نود الدقيقة وقواعد بيانات بوستجرس. دمج أنظمة الفواتير مع Stripe وإدارة اختبارات التحقق المؤتمتة.'
      },
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker', 'Jest'],
      sort_order: 2
    }
  ],
  services: [
    {
      id: 'sv1',
      title: { en: 'Full-Stack Web Apps', ar: 'تطبيقات الويب الشاملة' },
      description: {
        en: 'Architecting modern, dynamic web applications with state-of-the-art architectures using Next.js, React, Node, and Supabase.',
        ar: 'بناء تطبيقات ويب حديثة وديناميكية بهندسة متطورة باستخدام نيكست جي إس، ورياكت، ونود، وسوبابيس.'
      },
      icon: 'laptop',
      sort_order: 1
    },
    {
      id: 'sv2',
      title: { en: 'UI/UX & Creative Engineering', ar: 'واجهات المستخدم والهندسة الإبداعية' },
      description: {
        en: 'Designing and building premium, accessible interface layouts with smooth Framer Motion animations and responsive grid behaviors.',
        ar: 'تصميم وبناء واجهات مستخدم متميزة وسهلة الاستخدام مع رسوم متحركة سلسة وتخطيطات شبكية متجاوبة.'
      },
      icon: 'palette',
      sort_order: 2
    },
    {
      id: 'sv3',
      title: { en: 'Performance Optimization', ar: 'تحسين الأداء والسرعة' },
      description: {
        en: 'Auditing and resolving code bottlenecks, optimizing bundles, and achieving perfect Lighthouse scores for search engine visibility.',
        ar: 'مراجعة وحل اختناقات الأكواد وتحسين حزم التحميل وتحقيق درجات ممتازة في Lighthouse لرؤية محركات البحث.'
      },
      icon: 'zap',
      sort_order: 3
    }
  ],
  certifications: [
    {
      id: 'crt1',
      title: { en: 'AWS Certified Developer – Associate', ar: 'مطور معتمد من AWS - مساعد' },
      organization: { en: 'Amazon Web Services (AWS)', ar: 'أمازون ويب سيرفيسز (AWS)' },
      issue_date: '2025-05-10',
      credential_url: 'https://aws.amazon.com',
      image_url: '',
      sort_order: 1
    }
  ],
  testimonials: [
    {
      id: 't1',
      name: 'Sarah Jenkins',
      role: { en: 'Director of Engineering', ar: 'مدير الهندسة البرمجية' },
      company: 'Innovate Tech Labs',
      feedback: {
        en: 'Alex is an exceptional developer who delivers clean code, stunning visual transitions, and solid backend systems. A rare hybrid talent that elevates any project.',
        ar: 'أليكس هو مطور استثنائي يقدم أكواداً نظيفة، ورسوماً انتقالية مذهلة، وأنظمة خلفية متينة. موهبة هجينة نادرة ترفع من قيمة أي مشروع.'
      },
      image_url: '',
      published: true,
      sort_order: 1
    }
  ],
  projects: [
    {
      id: 'e2a84f33-1000-4b2e-a579-24751f211eb7',
      title: { en: 'E-Commerce Experience Engine', ar: 'محرك تجربة التجارة الإلكترونية' },
      description: {
        en: 'A highly interactive modern marketplace system featuring animated product views, dynamic checkout, and visual backoffice CMS.',
        ar: 'نظام سوق حديث تفاعلي للغاية يتميز بطرق عرض المنتجات المتحركة والدفع الديناميكي ونظام إدارة المحتوى الخلفي.'
      },
      full_description: {
        en: 'This application was built to demonstrate state management, clean routing, and interactive item customization grids. It utilizes server actions for cart persistence and secure payment token exchanges.',
        ar: 'تم بناء هذا التطبيق لإظهار إدارة الحالة والتحويلات النظيفة وشبكات تخصيص العناصر التفاعلية. يستخدم إجراءات الخادم لحفظ السلة وتبادل رموز الدفع الآمنة.'
      },
      challenges: {
        en: 'Handling high-volume image loading under slow networks while maintaining 60fps animations during product state swaps.',
        ar: 'التعامل مع تحميل الصور الكثيفة في الشبكات البطيئة مع الحفاظ على رسوم متحركة بمعدل 60 إطاراً في الثانية أثناء تغيير حالة المنتج.'
      },
      solutions: {
        en: 'Implemented next/image with blur placeholders, server-side pre-rendering, and CSS hardware-accelerated transform layers.',
        ar: 'تم تنفيذ next/image مع عناصر نائبة مشوشة، وتقديم الصفحات مسبقاً على الخادم، وطبقات تحويل تسريع الأجهزة باستخدام CSS.'
      },
      features: {
        en: ['Dynamic cart processing', 'RTL/LTR switching layouts', 'Admin panel stats logs'],
        ar: ['معالجة سلة تسوق ديناميكية', 'تخطيطات تبديل RTL/LTR', 'سجلات إحصاءات لوحة التحكم للمشرف']
      },
      cover_image: '',
      tech_stack: ['Next.js', 'React', 'Supabase', 'Stripe', 'Tailwind CSS', 'Framer Motion'],
      github_link: 'https://github.com',
      live_demo: 'https://example.com',
      category: 'Web Development',
      featured: true,
      status: 'Completed',
      completion_date: '2025-11-20',
      client: { en: 'Retail Tech Group', ar: 'مجموعة تقنيات التجزئة' },
      sort_order: 1,
      published: true
    }
  ],
  project_images: [] as Array<{ id: string; project_id: string; image_url: string; sort_order: number }>,
  media_library: [] as Array<{ id: string; filename: string; file_path: string; url: string; file_size: number; mime_type: string; width?: number; height?: number; created_at: string }>,
  contact_messages: [] as Array<{ id: string; name: string; email: string; phone?: string; subject?: string; message: string; status: 'unread' | 'read' | 'archived'; created_at: string }>,
  activity_logs: [] as Array<{ id: string; user_id?: string; action: string; details?: string; created_at: string }>
};

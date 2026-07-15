-- Supabase Seed: seed.sql

-- Clear tables (just in case)
truncate public.translations cascade;
truncate public.site_settings cascade;
truncate public.hero cascade;
truncate public.about cascade;
truncate public.navigation cascade;
truncate public.social_links cascade;
truncate public.skill_categories cascade;
truncate public.skills cascade;
truncate public.experience cascade;
truncate public.projects cascade;
truncate public.services cascade;
truncate public.testimonials cascade;
truncate public.certifications cascade;

-- Seed Site Settings
insert into public.site_settings (id, site_name, contact_email, phone, meta_title, meta_description, keywords, location, footer_text)
values (
  true,
  'Alex Morgan | Portfolio CMS',
  'contact@alexmorgan.dev',
  '+1 (555) 019-2834',
  '{"en": "Alex Morgan | Senior Creative Developer & Designer", "ar": "أليكس مورجان | مطور ومصمم إبداعي أول"}'::jsonb,
  '{"en": "Senior Creative Developer specialized in building polished user interfaces, performance optimization, and custom web applications.", "ar": "مطور إبداعي أول متخصص في بناء واجهات مستخدم مصقولة، وتحسين الأداء، وتطبيقات الويب المخصصة."}'::jsonb,
  '{"en": ["React", "Next.js", "TypeScript", "Tailwind CSS", "CMS", "Portfolio"], "ar": ["رياكت", "نيكست جي إس", "تايب سكريبت", "تيلويند سي إس إس", "نظام إدارة المحتوى", "معرض الأعمال"]}'::jsonb,
  '{"en": "San Francisco, CA", "ar": "سان فرانسيسكو، كاليفورنيا"}'::jsonb,
  '{"en": "© 2026 Alex Morgan. Built with Next.js & Supabase.", "ar": "© 2026 أليكس مورجان. تم البناء بواسطة نيكست جي إس وسوبابيس."}'::jsonb
);

-- Seed Hero Section
insert into public.hero (id, name, title, subtitle, cta_text, cta_link, cta_text_secondary, cta_link_secondary, background_animation)
values (
  true,
  '{"en": "Alex Morgan", "ar": "أليكس مورجان"}'::jsonb,
  '{"en": "Senior Creative Developer & UI Architect", "ar": "مطور إبداعي أول ومهندس واجهات"}'::jsonb,
  '{"en": "Handcrafting immersive web experiences that merge storytelling with robust production-ready code.", "ar": "صياغة تجارب ويب غامرة تدمج سرد القصص مع برمجيات قوية جاهزة للإنتاج."}'::jsonb,
  '{"en": "View Projects", "ar": "عرض المشاريع"}'::jsonb,
  '#projects',
  '{"en": "Get in Touch", "ar": "تواصل معي"}'::jsonb,
  '#contact',
  'particles'
);

-- Seed About Section
insert into public.about (id, biography, skills_summary, cv_url, profile_image_url)
values (
  true,
  '{"en": "I am a design-driven software engineer with 8+ years of experience crafting beautiful, highly interactive applications. I bridge the gap between complex engineering architectures and visual design systems. My focus is on writing clean, modular code that runs with 60fps animations.", "ar": "أنا مهندس برمجيات مهتم بالتصميم لدي أكثر من 8 سنوات من الخبرة في صياغة تطبيقات جميلة وتفاعلية للغاية. أقوم بسد الفجوة بين هندسة البرمجيات المعقدة وأنظمة التصميم المرئي. ينصب تركيزي على كتابة أكواد برمجية نظيفة وقابلة لإعادة الاستخدام تعمل برسوم متحركة سلسة للغاية."}'::jsonb,
  '{"en": "Experienced across full stack React, Next.js, Node, Golang, PostgreSQL, and scalable cloud architectures. Passionate about design tokens, page performance, and screen reader accessibility.", "ar": "خبرة واسعة في العمل مع رياكت، نيكست جي إس، نود، جو لانج، بوستجرس، وبنى سحابية قابلة للتطوير. شغوف برؤوس التصميم، وأداء صفحات الويب، وإمكانية الوصول لقارئات الشاشة."}'::jsonb,
  '#',
  ''
);

-- Seed Static UI Translations
insert into public.translations (key, en, ar) values
('nav_home', 'Home', 'الرئيسية'),
('nav_about', 'About', 'من أنا'),
('nav_skills', 'Skills', 'المهارات'),
('nav_experience', 'Experience', 'الخبرة'),
('nav_projects', 'Projects', 'المشاريع'),
('nav_services', 'Services', 'الخدمات'),
('nav_testimonials', 'Testimonials', 'الآراء'),
('nav_certifications', 'Certifications', 'الشهادات'),
('nav_contact', 'Contact', 'اتصل بي'),
('skills_title', 'Skills & Expertise', 'المهارات والخبرات'),
('skills_subtitle', 'Categorized overview of my technical stack and proficiency levels', 'نظرة عامة مصنفة على تقنياتي ومستويات كفاءتي'),
('experience_title', 'Work History', 'الخبرة المهنية'),
('experience_subtitle', 'Timeline of my professional journey in software engineering', 'مسار رحلتي المهنية في هندسة البرمجيات'),
('projects_title', 'Featured Projects', 'المشاريع المميزة'),
('projects_subtitle', 'A selection of products I have architected and delivered recently', 'مجموعة مختارة من المنتجات التي قمت ببنائها وتسليمها مؤخراً'),
('services_title', 'Services Offered', 'الخدمات المقدمة'),
('services_subtitle', 'How I can help bring your ideas and digital designs to life', 'كيف يمكنني المساعدة في إحياء أفكارك وتصاميمك الرقمية'),
('testimonials_title', 'Client Recommendations', 'آراء وتوصيات العملاء'),
('testimonials_subtitle', 'Kind words from colleagues, clients, and engineering leaders', 'كلمات لطيفة من الزملاء والعملاء وقادة الهندسة البرمجية'),
('certifications_title', 'Licenses & Certifications', 'الشهادات والتراخيص'),
('certifications_subtitle', 'Professional credentials and continuous learning verification', 'الاعتمادات المهنية والتحقق من التعلم المستمر'),
('contact_title', 'Let''s Create Together', 'دعنا نعمل معاً'),
('contact_subtitle', 'Send a message to discuss your project or job opportunities', 'أرسل رسالة لمناقشة مشروعك أو الفرص الوظيفية المتاحة'),
('contact_name', 'Full Name', 'الاسم الكامل'),
('contact_email', 'Email Address', 'البريد الإلكتروني'),
('contact_phone', 'Phone Number', 'رقم الهاتف'),
('contact_subject', 'Subject', 'الموضوع'),
('contact_message', 'Message', 'الرسالة'),
('contact_submit', 'Send Message', 'إرسال الرسالة'),
('contact_sending', 'Sending...', 'جاري الإرسال...'),
('contact_success', 'Thank you! Your message has been saved and sent successfully.', 'شكراً لك! تم حفظ وإرسال رسالتك بنجاح.'),
('cv_download', 'Download Resume / CV', 'تحميل السيرة الذاتية'),
('read_more', 'Read More', 'اقرأ المزيد'),
('view_project', 'View Project Details', 'عرض تفاصيل المشروع'),
('github_repo', 'GitHub Repository', 'مستودع جيت هاب'),
('live_demo', 'Live Demo', 'العرض المباشر'),
('admin_login', 'Admin Access Portal', 'بوابة دخول المشرف'),
('admin_dashboard', 'Dashboard Home', 'الرئيسية لوحة التحكم'),
('status_draft', 'Draft', 'مسودة'),
('status_inprogress', 'In Progress', 'قيد العمل'),
('status_completed', 'Completed', 'مكتمل'),
('client_label', 'Client', 'العميل'),
('date_label', 'Completion Date', 'تاريخ الإنجاز'),
('category_label', 'Category', 'الفئة'),
('all_categories', 'All Projects', 'كل المشاريع');

-- Seed Navigation
insert into public.navigation (label, path, sort_order, visible) values
('{"en": "Home", "ar": "الرئيسية"}'::jsonb, '#hero', 1, true),
('{"en": "About", "ar": "من أنا"}'::jsonb, '#about', 2, true),
('{"en": "Skills", "ar": "المهارات"}'::jsonb, '#skills', 3, true),
('{"en": "Experience", "ar": "الخبرة"}'::jsonb, '#experience', 4, true),
('{"en": "Projects", "ar": "المشاريع"}'::jsonb, '#projects', 5, true),
('{"en": "Services", "ar": "الخدمات"}'::jsonb, '#services', 6, true),
('{"en": "Testimonials", "ar": "الآراء"}'::jsonb, '#testimonials', 7, true),
('{"en": "Certifications", "ar": "الشهادات"}'::jsonb, '#certifications', 8, true),
('{"en": "Contact", "ar": "اتصل بي"}'::jsonb, '#contact', 9, true);

-- Seed Social Links
insert into public.social_links (platform, url, icon, sort_order) values
('GitHub', 'https://github.com', 'github', 1),
('LinkedIn', 'https://linkedin.com', 'linkedin', 2),
('Twitter', 'https://twitter.com', 'twitter', 3);

-- Seed Skill Categories
insert into public.skill_categories (id, name, sort_order) values
('c1a84f33-1000-4b2e-a579-24751f211eb1', '{"en": "Frontend Engineering", "ar": "هندسة الواجهات الأمامية"}'::jsonb, 1),
('c1a84f33-2000-4b2e-a579-24751f211eb2', '{"en": "Backend & Databases", "ar": "الخلفية وقواعد البيانات"}'::jsonb, 2),
('c1a84f33-3000-4b2e-a579-24751f211eb3', '{"en": "Cloud & DevOps", "ar": "الحوسبة السحابية والعمليات"}'::jsonb, 3);

-- Seed Skills
insert into public.skills (category_id, name, icon, proficiency, sort_order) values
('c1a84f33-1000-4b2e-a579-24751f211eb1', 'React / Next.js (App Router)', 'react', 95, 1),
('c1a84f33-1000-4b2e-a579-24751f211eb1', 'TypeScript & ESNext', 'code-2', 90, 2),
('c1a84f33-1000-4b2e-a579-24751f211eb1', 'Tailwind CSS & Framer Motion', 'paint-brush', 92, 3),
('c1a84f33-2000-4b2e-a579-24751f211eb2', 'Node.js / Next Server Actions', 'server', 88, 1),
('c1a84f33-2000-4b2e-a579-24751f211eb2', 'PostgreSQL & Supabase API', 'database', 85, 2),
('c1a84f33-2000-4b2e-a579-24751f211eb2', 'Redis Caching & REST/GraphQL APIs', 'cpu', 80, 3),
('c1a84f33-3000-4b2e-a579-24751f211eb3', 'Vercel & AWS Deployments', 'cloud', 82, 1),
('c1a84f33-3000-4b2e-a579-24751f211eb3', 'Git, GitHub Actions & CI/CD', 'git-branch', 86, 2),
('c1a84f33-3000-4b2e-a579-24751f211eb3', 'Docker & Containerization', 'container', 70, 3);

-- Seed Experiences
insert into public.experience (company, position, start_date, end_date, current, description, technologies, sort_order) values
(
  'Innovate Tech Labs',
  '{"en": "Lead UI Engineer", "ar": "مهندس واجهات قيادي"}'::jsonb,
  '2024-01-15',
  null,
  true,
  '{"en": "Leading the frontend transition to Next.js App router, improving Core Web Vitals LCP by 45%. Established custom visual token themes and mentored junior React devs.", "ar": "قيادة انتقال الواجهات الأمامية إلى نيكست جي إس، وتحسين مؤشرات أداء الويب بنسبة 45%. إنشاء رموز أنماط مخصصة وتدريب المطورين الجدد."}'::jsonb,
  array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  1
),
(
  'Alpha Solutions Corp',
  '{"en": "Software Engineer II", "ar": "مهندس برمجيات ثاني"}'::jsonb,
  '2021-06-01',
  '2023-12-31',
  false,
  '{"en": "Architected full stack features utilizing Node.js microservices and PostgreSQL. Integrated Stripe billing systems and managed automated Jest validation workflows.", "ar": "بناء ميزات شاملة باستخدام خدمات نود الدقيقة وقواعد بيانات بوستجرس. دمج أنظمة الفواتير مع Stripe وإدارة اختبارات التحقق المؤتمتة."}'::jsonb,
  array['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker', 'Jest'],
  2
);

-- Seed Services
insert into public.services (title, description, icon, sort_order) values
(
  '{"en": "Full-Stack Web Apps", "ar": "تطبيقات الويب الشاملة"}'::jsonb,
  '{"en": "Architecting modern, dynamic web applications with state-of-the-art architectures using Next.js, React, Node, and Supabase.", "ar": "بناء تطبيقات ويب حديثة وديناميكية بهندسة متطورة باستخدام نيكست جي إس، ورياكت، ونود، وسوبابيس."}'::jsonb,
  'laptop',
  1
),
(
  '{"en": "UI/UX & Creative Engineering", "ar": "واجهات المستخدم والهندسة الإبداعية"}'::jsonb,
  '{"en": "Designing and building premium, accessible interface layouts with smooth Framer Motion animations and responsive grid behaviors.", "ar": "تصميم وبناء واجهات مستخدم متميزة وسهلة الاستخدام مع رسوم متحركة سلسة وتخطيطات شبكية متجاوبة."}'::jsonb,
  'palette',
  2
),
(
  '{"en": "Performance Optimization", "ar": "تحسين الأداء والسرعة"}'::jsonb,
  '{"en": "Auditing and resolving code bottlenecks, optimizing bundles, and achieving perfect Lighthouse scores for search engine visibility.", "ar": "مراجعة وحل اختناقات الأكواد وتحسين حزم التحميل وتحقيق درجات ممتازة في Lighthouse لرؤية محركات البحث."}'::jsonb,
  'zap',
  3
);

-- Seed Certifications
insert into public.certifications (title, organization, issue_date, credential_url, image_url, sort_order) values
(
  '{"en": "AWS Certified Developer – Associate", "ar": "مطور معتمد من AWS - مساعد"}'::jsonb,
  '{"en": "Amazon Web Services (AWS)", "ar": "أمازون ويب سيرفيسز (AWS)"}'::jsonb,
  '2025-05-10',
  'https://aws.amazon.com',
  '',
  1
);

-- Seed Testimonials
insert into public.testimonials (name, role, company, feedback, image_url, published, sort_order) values
(
  'Sarah Jenkins',
  '{"en": "Director of Engineering", "ar": "مدير الهندسة البرمجية"}'::jsonb,
  'Innovate Tech Labs',
  '{"en": "Alex is an exceptional developer who delivers clean code, stunning visual transitions, and solid backend systems. A rare hybrid talent that elevates any project.", "ar": "أليكس هو مطور استثنائي يقدم أكواداً نظيفة، ورسوماً انتقالية مذهلة، وأنظمة خلفية متينة. موهبة هجينة نادرة ترفع من قيمة أي مشروع."}'::jsonb,
  '',
  true,
  1
);

-- Seed Sample Project
insert into public.projects (id, title, description, full_description, challenges, solutions, features, cover_image, tech_stack, github_link, live_demo, category, featured, status, completion_date, client, sort_order, published)
values (
  'e2a84f33-1000-4b2e-a579-24751f211eb7',
  '{"en": "E-Commerce Experience Engine", "ar": "محرك تجربة التجارة الإلكترونية"}'::jsonb,
  '{"en": "A highly interactive modern marketplace system featuring animated product views, dynamic checkout, and visual backoffice CMS.", "ar": "نظام سوق حديث تفاعلي للغاية يتميز بطرق عرض المنتجات المتحركة والدفع الديناميكي ونظام إدارة المحتوى الخلفي."}'::jsonb,
  '{"en": "This application was built to demonstrate state management, clean routing, and interactive item customization grids. It utilizes server actions for cart persistence and secure payment token exchanges.", "ar": "تم بناء هذا التطبيق لإظهار إدارة الحالة والتحويلات النظيفة وشبكات تخصيص العناصر التفاعلية. يستخدم إجراءات الخادم لحفظ السلة وتبادل رموز الدفع الآمنة."}'::jsonb,
  '{"en": "Handling high-volume image loading under slow networks while maintaining 60fps animations during product state swaps.", "ar": "التعامل مع تحميل الصور الكثيفة في الشبكات البطيئة مع الحفاظ على رسوم متحركة بمعدل 60 إطاراً في الثانية أثناء تغيير حالة المنتج."}'::jsonb,
  '{"en": "Implemented next/image with blur placeholders, server-side pre-rendering, and CSS hardware-accelerated transform layers.", "ar": "تم تنفيذ next/image مع عناصر نائبة مشوشة، وتقديم الصفحات مسبقاً على الخادم، وطبقات تحويل تسريع الأجهزة باستخدام CSS."}'::jsonb,
  '{"en": ["Dynamic cart processing", "RTL/LTR switching layouts", "Admin panel stats logs"], "ar": ["معالجة سلة تسوق ديناميكية", "تخطيطات تبديل RTL/LTR", "سجلات إحصاءات لوحة التحكم للمشرف"]}'::jsonb,
  '',
  array['Next.js', 'React', 'Supabase', 'Stripe', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com',
  'https://example.com',
  'Web Development',
  true,
  'Completed',
  '2025-11-20',
  '{"en": "Retail Tech Group", "ar": "مجموعة تقنيات التجزئة"}'::jsonb,
  1,
  true
);

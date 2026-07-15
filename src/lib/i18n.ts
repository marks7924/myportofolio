import { getTranslations } from './db';

// Helper to resolve localized JSON fields (e.g. {"en": "...", "ar": "..."})
export function translate(field: any, locale: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    // Check key explicitly, then fall back to english, then first available key
    if (field[locale] !== undefined && field[locale] !== null) {
      return field[locale];
    }
    if (field['en'] !== undefined && field['en'] !== null) {
      return field['en'];
    }
    const keys = Object.keys(field);
    if (keys.length > 0) {
      return field[keys[0]] || '';
    }
  }
  return String(field);
}

// Retrieve UI translations dictionary
export async function getDictionary(locale: string): Promise<Record<string, string>> {
  const translations = await getTranslations();
  const dictionary: Record<string, string> = {};

  // Standard static defaults as fallback
  const defaults: Record<string, Record<string, string>> = {
    nav_home: { en: 'Home', ar: 'الرئيسية' },
    nav_about: { en: 'About', ar: 'من أنا' },
    nav_skills: { en: 'Skills', ar: 'المهارات' },
    nav_experience: { en: 'Experience', ar: 'الخبرة' },
    nav_projects: { en: 'Projects', ar: 'المشاريع' },
    nav_services: { en: 'Services', ar: 'الخدمات' },
    nav_testimonials: { en: 'Testimonials', ar: 'الآراء' },
    nav_certifications: { en: 'Certifications', ar: 'الشهادات' },
    nav_contact: { en: 'Contact', ar: 'اتصل بي' },
    skills_title: { en: 'Skills & Expertise', ar: 'المهارات والخبرات' },
    skills_subtitle: { en: 'Categorized overview of my technical stack and proficiency levels', ar: 'نظرة عامة مصنفة على تقنياتي ومستويات كفاءتي' },
    experience_title: { en: 'Work History', ar: 'الخبرة المهنية' },
    experience_subtitle: { en: 'Timeline of my professional journey in software engineering', ar: 'مسار رحلتي المهنية في هندسة البرمجيات' },
    projects_title: { en: 'Featured Projects', ar: 'المشاريع المميزة' },
    projects_subtitle: { en: 'A selection of products I have architected and delivered recently', ar: 'مجموعة مختارة من المنتجات التي قمت ببنائها وتسليمها مؤخراً' },
    services_title: { en: 'Services Offered', ar: 'الخدمات المقدمة' },
    services_subtitle: { en: 'How I can help bring your ideas and digital designs to life', ar: 'كيف يمكنني المساعدة في إحياء أفكارك وتصاميمك الرقمية' },
    testimonials_title: { en: 'Client Recommendations', ar: 'آراء وتوصيات العملاء' },
    testimonials_subtitle: { en: 'Kind words from colleagues, clients, and engineering leaders', ar: 'كلمات لطيفة من الزملاء والعملاء وقادة الهندسة البرمجية' },
    certifications_title: { en: 'Licenses & Certifications', ar: 'الشهادات والتراخيص' },
    certifications_subtitle: { en: 'Professional credentials and continuous learning verification', ar: 'الاعتمادات المهنية والتحقق من التعلم المستمر' },
    contact_title: { en: "Let's Create Together", ar: 'دعنا نعمل معاً' },
    contact_subtitle: { en: 'Send a message to discuss your project or job opportunities', ar: 'أرسل رسالة لمناقشة مشروعك أو الفرص الوظيفية المتاحة' },
    contact_name: { en: 'Full Name', ar: 'الاسم الكامل' },
    contact_email: { en: 'Email Address', ar: 'البريد الإلكتروني' },
    contact_phone: { en: 'Phone Number', ar: 'رقم الهاتف' },
    contact_subject: { en: 'Subject', ar: 'الموضوع' },
    contact_message: { en: 'Message', ar: 'الرسالة' },
    contact_submit: { en: 'Send Message', ar: 'إرسال الرسالة' },
    contact_sending: { en: 'Sending...', ar: 'جاري الإرسال...' },
    contact_success: { en: 'Thank you! Your message has been saved and sent successfully.', ar: 'شكراً لك! تم حفظ وإرسال رسالتك بنجاح.' },
    cv_download: { en: 'Download Resume / CV', ar: 'تحميل السيرة الذاتية' },
    read_more: { en: 'Read More', ar: 'اقرأ المزيد' },
    view_project: { en: 'View Project Details', ar: 'عرض تفاصيل المشروع' },
    github_repo: { en: 'GitHub Repository', ar: 'مستودع جيت هاب' },
    live_demo: { en: 'Live Demo', ar: 'العرض المباشر' },
    admin_login: { en: 'Admin Access Portal', ar: 'بوابة دخول المشرف' },
    admin_dashboard: { en: 'Dashboard Home', ar: 'الرئيسية لوحة التحكم' },
    status_draft: { en: 'Draft', ar: 'مسودة' },
    status_inprogress: { en: 'In Progress', ar: 'قيد العمل' },
    status_completed: { en: 'Completed', ar: 'مكتمل' },
    client_label: { en: 'Client', ar: 'العميل' },
    date_label: { en: 'Completion Date', ar: 'تاريخ الإنجاز' },
    category_label: { en: 'Category', ar: 'الفئة' },
    all_categories: { en: 'All Projects', ar: 'كل المشاريع' }
  };

  // Populate from DB, falling back to defaults if not found
  translations.forEach(t => {
    dictionary[t.key] = locale === 'ar' ? t.ar : t.en;
  });

  // Inject defaults for keys that might be missing in translations
  Object.keys(defaults).forEach(key => {
    if (!dictionary[key]) {
      dictionary[key] = defaults[key][locale] || defaults[key]['en'];
    }
  });

  return dictionary;
}

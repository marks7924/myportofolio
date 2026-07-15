'use server';

import { z } from 'zod';
import { createServerSideClient } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || null,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  };

  // 1. Zod Validation
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const validated = result.data;

  // 3. PostgreSQL Database write
  try {
    const supabase = await createServerSideClient();
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      subject: validated.subject,
      message: validated.message,
      status: 'unread',
    });

    if (dbError) throw dbError;
  } catch (dbErr: any) {
    console.error('Database write error:', dbErr);
    return { success: false, error: 'Failed to save message in database.' };
  }

  // 4. NodeMailer SMTP alert triggers
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass && smtpUser !== 'placeholder-user') {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${validated.name}" <${smtpUser}>`,
        replyTo: validated.email,
        to: adminEmail,
        subject: `New Portfolio Message: ${validated.subject}`,
        text: `Name: ${validated.name}\nEmail: ${validated.email}\nPhone: ${validated.phone || 'N/A'}\nSubject: ${validated.subject}\n\nMessage:\n${validated.message}`,
        html: `
          <h3>New Contact Message received on Portfolio</h3>
          <p><strong>Name:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          <p><strong>Phone:</strong> ${validated.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${validated.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${validated.message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Nodemailer SMTP alert error:', emailErr);
    }
  } else {
    console.warn('Skipping email notification: SMTP configuration is missing or placeholder.');
  }

  return { success: true };
}

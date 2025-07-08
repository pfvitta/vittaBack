// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');

import { textMails } from './textMails';

export const envioConfirmacion = async (
  tipoEmail: string,
  email: string,
  args?: { title?: string; content?: string; name?: string }
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pfvitta@gmail.com',
      pass: 'cttk ajuk yqbu pwan',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // ✅ Aquí usas args para personalizar el correo
    const mailOptions = await textMails(tipoEmail, email, args);

    await transporter.sendMail(mailOptions);
    console.log('Email enviado con éxito a:', email);
  } catch (error) {
    console.error('Error al enviar el email:', error);
  }
};

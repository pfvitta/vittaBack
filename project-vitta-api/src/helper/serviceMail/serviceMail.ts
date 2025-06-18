// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');

import { textMails } from './textMails';

export const envioConfirmacion = async (tipoEmail: string, email: string) => {
    // Configurar el transporte
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pfvitta@gmail.com",
            pass: "cttk ajuk yqbu pwan"  
           },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    try {
    // Obtener el contenido del correo
    const mailOptions = await textMails(tipoEmail, email); // Asegúrate que la función textMails acepte el email

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log('Email enviado con éxito a:', email);
  } catch (error) {
    console.error('Error al enviar el email:', error);
  }
};
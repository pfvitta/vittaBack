export const textMails = async (tipoEmail: string, email: string) => {
  let mailOptions: any = {};

  switch (tipoEmail) {
    case 'welcomeUser':
      mailOptions = {
        from: '"Mensaje de Bienvenida - Vitta" <pfvitta@gmail.com>',
        to: email,
        subject: 'Saludos, ¡tu cuenta ha sido creada!',
        html: `
          <p>¡Gracias por registrarte en Vitta!</p><br>
          <p>Estamos muy felices de que formes parte de nuestra comunidad de bienestar y nutrición.💈</p><br>

          <p>En Vitta, te ofrecemos una plataforma integral para cuidar de tu salud y bienestar. Aquí podrás:</p>

          <ul>
              <li> 🥦 Acceder a un equipo de nutricionistas certificados</li>
              <li> 📅 Agendar consultas de forma rápida y segura</li>
              <li> 📈 Llevar un seguimiento personalizado de tu progreso</li>
              <li> 📚 Recibir contenido exclusivo sobre salud y nutrición</li>
          </ul><br>

          <p>¡No te pierdas ningún momento! 😊</p><br>

          <p>¡Gracias por unirte a nosotros en Vitta!</p><br>

          <p>Atentamente,</p><br>
          <p>El equipo de Vitta</p>
          <p>Vive con propósito, aliméntate con ciencia</p><br>
          <p>Saludos cordiales,</p><br>
          `,
      };
      break;

    case 'welcomeProvider':
      mailOptions = {
        from: '"Bienvenida Profesional - Vitta" <pfvitta@gmail.com>',
        to: email,
        subject: '¡Bienvenido a Vitta como profesional de la salud!',
        html: `
            <p>Gracias por registrarte como profesional en Vitta. 🎉

            Tu perfil será revisado por nuestro equipo. Si todo está en orden, recibirás un correo de confirmación.</p>

            <p>Estaremos emocionados de tenerte como parte de nuestra comunidad de profesionales de la salud y nutrición. 💚</p><br>

          <p>Como profesional Vitta, podrás:</p>
          <ul>
              <li>📅 Ofrecer tus servicios a cientos de usuarios que buscan mejorar su bienestar</li>
              <li>🧾 Gestionar tus citas de manera eficiente y segura</li>
              <li>📊 Acceder a herramientas para llevar el seguimiento clínico de tus pacientes</li>
              <li>🚀 Impulsar tu visibilidad como profesional de la salud</li>
          </ul><br>

          <p>Estamos aquí para apoyarte en cada paso. 💚</p><br>

          <p>¡Bienvenido(a) a Vitta, donde cuidamos la salud juntos!</p><br>

          <p>Atentamente,</p><br>
          <p>El equipo de Vitta</p>
          <p>Vive con propósito, aliméntate con ciencia.</p><br>
        `,
      };
      break;

      case "paymentSuccess":
      mailOptions = {
          from: '"Pago Exitoso - Vitta" <pfvitta@gmail.com>',
          to: email,
          subject: "🎉 ¡Tu pago fue exitoso!",
          html: `
            <p>¡Gracias por tu pago en Vitta! 🎉</p>
            <p>Tu membresía ha sido activada exitosamente.</p>
            <p>Disfruta de todos los beneficios que ofrecemos.</p><br>
            <p>Atentamente,<br>Equipo Vitta</p>
          `,
       };
        break;

    case "paymentCancel":
        mailOptions = {
          from: '"Pago Cancelado - Vitta" <pfvitta@gmail.com>',
          to: email,
          subject: "⛔ Tu pago fue cancelado",
          html: `
            <p>Lamentamos que hayas cancelado el pago. 😔</p>
            <p>Si fue un error o deseas intentarlo de nuevo, puedes volver a ingresar a Vitta y finalizar tu pago.</p><br>
            <p>Atentamente,<br>Equipo Vitta</p>
          `,
      };
      break;


    default:
      throw new Error(`Tipo de email no soportado: ${tipoEmail}`);
  }

  return mailOptions;
};

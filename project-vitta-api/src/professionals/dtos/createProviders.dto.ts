export class createProvidersDto {
  // ID único autogenerado
  id: string;

  // ID del usuario relacionado
  usuarioId: string;

  // Biografía del profesional
  biografia: string;

  // ¿Fue validado manualmente?
  validado: boolean;

  // ID  del validador (admin)
  verificadoPor: string;

  // Experiencia profesional (texto libre)
  experiencia: string;

  // Precio por consulta (guardado como número)
  precioConsulta: number;

  // URL frontal de la tarjeta profesional
  tarjetaProfesionalFrontalUrl: string;

  // URL trasera de la tarjeta profesional
  tarjetaProfesionalTraseraUrl: string;
}

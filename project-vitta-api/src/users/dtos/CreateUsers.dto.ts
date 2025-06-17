export class CreateUsersDto {
  // ID generado automáticamente en formato UUID
  id: string;

  // Nombre completo del usuario
  name: string;

  // Correo electrónico único
  email: string;

  // Contraseña hasheada (bcrypt genera hasta 60 caracteres)
  password: string;

  // Rol del usuario (ej: admin, nutricionista, user)
  rol: string;

  // Tipo de documento (ej: CC, CE, TI)
  tipoDocumento: string;

  // Número de documento único
  numeroDocumento: string;

  // URL de la imagen del frente del documento
  documentoFrontalUrl: string;

  // URL de la imagen del reverso del documento
  documentoTraseroUrl: string;

  // Ciudad o lugar donde se expidió el documento
  lugarExpedicion: string;

  // Fecha de nacimiento del usuario
  fechaNacimiento: Date;

  // Estado del usuario (activo o no)
  activo: boolean;

  // Fecha de creación del registro (generado automáticamente)
  creadoEn: Date;
}

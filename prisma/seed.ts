import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  // ── Superadmin (sin empresa) ──
  await prisma.perfil.create({
    data: {
      email: 'superadmin@asistenciaqr.com',
      password: hashedPassword,
      nombre: 'Super',
      apellido: 'Admin',
      rol: Role.SUPERADMIN,
      estado: true,
    },
  });

  console.log('✓ Superadmin creado');

  // ── Empresa 1: Colegio San José ──
  const colegio = await prisma.empresa.create({
    data: { nombre: 'Colegio San José', maxEmpleados: 30 },
  });

  const adminColegio = await prisma.perfil.create({
    data: {
      email: 'admin@colegio.com',
      password: hashedPassword,
      nombre: 'Carlos',
      apellido: 'García',
      rol: Role.ADMIN,
      empresaId: colegio.id,
      estado: true,
    },
  });

  // Turnos del colegio
  const turnosColegio = [
    { nombre: 'Mañana', horaEntrada: '07:00:00', horaTolerancia: '07:15:00', horaSalida: '12:00:00', empresaId: colegio.id },
    { nombre: 'Tarde', horaEntrada: '13:00:00', horaTolerancia: '13:15:00', horaSalida: '18:00:00', empresaId: colegio.id },
    { nombre: 'Noche', horaEntrada: '19:00:00', horaTolerancia: '19:15:00', horaSalida: '22:00:00', empresaId: colegio.id },
  ];
  await prisma.turno.createMany({ data: turnosColegio });
  const [mananaC, tardeC, nocheC] = await prisma.turno.findMany({ where: { empresaId: colegio.id }, orderBy: { nombre: 'asc' } });

  // Terminal del colegio
  await prisma.perfil.create({
    data: {
      email: 'terminal@colegio.com',
      password: hashedPassword,
      nombre: 'Terminal',
      apellido: 'Colegio',
      rol: Role.TERMINAL,
      empresaId: colegio.id,
      estado: true,
    },
  });

  // Empleados del colegio
  await prisma.perfil.createMany({
    data: [
      { email: 'maria.lopez@colegio.com', password: hashedPassword, nombre: 'María', apellido: 'López', rol: Role.EMPLEADO, turnoId: mananaC.id, empresaId: colegio.id, estado: true },
      { email: 'juan.perez@colegio.com', password: hashedPassword, nombre: 'Juan', apellido: 'Pérez', rol: Role.EMPLEADO, turnoId: mananaC.id, empresaId: colegio.id, estado: true },
      { email: 'ana.torres@colegio.com', password: hashedPassword, nombre: 'Ana', apellido: 'Torres', rol: Role.EMPLEADO, turnoId: tardeC.id, empresaId: colegio.id, estado: true },
      { email: 'luis.ramos@colegio.com', password: hashedPassword, nombre: 'Luis', apellido: 'Ramos', rol: Role.EMPLEADO, turnoId: nocheC.id, empresaId: colegio.id, estado: true },
    ],
  });

  console.log('✓ Colegio San José — admin: admin@colegio.com');

  // ── Empresa 2: Clínica Los Andes ──
  const clinica = await prisma.empresa.create({
    data: { nombre: 'Clínica Los Andes', maxEmpleados: 50 },
  });

  const adminClinica = await prisma.perfil.create({
    data: {
      email: 'admin@clinica.com',
      password: hashedPassword,
      nombre: 'Rosa',
      apellido: 'Mendoza',
      rol: Role.ADMIN,
      empresaId: clinica.id,
      estado: true,
    },
  });

  const turnosClinica = [
    { nombre: 'Mañana', horaEntrada: '06:00:00', horaTolerancia: '06:15:00', horaSalida: '14:00:00', empresaId: clinica.id },
    { nombre: 'Tarde', horaEntrada: '14:00:00', horaTolerancia: '14:15:00', horaSalida: '22:00:00', empresaId: clinica.id },
    { nombre: 'Noche', horaEntrada: '22:00:00', horaTolerancia: '22:15:00', horaSalida: '06:00:00', empresaId: clinica.id },
  ];
  await prisma.turno.createMany({ data: turnosClinica });
  const [mananaCl, tardeCl, nocheCl] = await prisma.turno.findMany({ where: { empresaId: clinica.id }, orderBy: { nombre: 'asc' } });

  await prisma.perfil.create({
    data: {
      email: 'terminal@clinica.com',
      password: hashedPassword,
      nombre: 'Terminal',
      apellido: 'Clínica',
      rol: Role.TERMINAL,
      empresaId: clinica.id,
      estado: true,
    },
  });

  await prisma.perfil.createMany({
    data: [
      { email: 'pedro.quilca@clinica.com', password: hashedPassword, nombre: 'Pedro', apellido: 'Quilca', rol: Role.EMPLEADO, turnoId: mananaCl.id, empresaId: clinica.id, estado: true },
      { email: 'sofia.castro@clinica.com', password: hashedPassword, nombre: 'Sofía', apellido: 'Castro', rol: Role.EMPLEADO, turnoId: tardeCl.id, empresaId: clinica.id, estado: true },
      { email: 'diego.saenz@clinica.com', password: hashedPassword, nombre: 'Diego', apellido: 'Sáenz', rol: Role.EMPLEADO, turnoId: nocheCl.id, empresaId: clinica.id, estado: true },
    ],
  });

  console.log('✓ Clínica Los Andes — admin: admin@clinica.com');

  console.log('\n═══ Credenciales ═══');
  console.log('Superadmin: superadmin@asistenciaqr.com / admin1234');
  console.log('Admin Colegio: admin@colegio.com / admin1234');
  console.log('Admin Clínica: admin@clinica.com / admin1234');
  console.log('Terminal Colegio: terminal@colegio.com / admin1234');
  console.log('Terminal Clínica: terminal@clinica.com / admin1234');
  console.log('Empleado Colegio: maria.lopez@colegio.com / admin1234');
  console.log('Empleado Clínica: pedro.quilca@clinica.com / admin1234');
  console.log('\nSeed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

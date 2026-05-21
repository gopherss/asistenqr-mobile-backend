import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  await prisma.profile.upsert({
    where: { email: 'director@colegio.com' },
    update: {},
    create: {
      email: 'director@colegio.com',
      password: hashedPassword,
      nombres: 'Director General',
      rol: Role.DIRECTOR,
      estado: true,
    },
  });

  await prisma.profile.upsert({
    where: { email: 'terminal@colegio.com' },
    update: {},
    create: {
      email: 'terminal@colegio.com',
      password: hashedPassword,
      nombres: 'Terminal QR',
      rol: Role.TERMINAL,
      estado: true,
    },
  });
  
  await prisma.profile.upsert({
    where: { email: 'docente@colegio.com' },
    update: {},
    create: {
      email: 'docente@colegio.com',
      password: hashedPassword,
      nombres: 'Sandro Castro Paredes',
      rol: Role.DOCENTE,
      estado: true,
    },
  });

  const turnos = [
    { nombre: 'Mañana', horaEntrada: '07:00:00', horaTolerancia: '07:15:00', horaSalida: '12:00:00' },
    { nombre: 'Tarde', horaEntrada: '13:00:00', horaTolerancia: '13:15:00', horaSalida: '18:00:00' },
    { nombre: 'Noche', horaEntrada: '19:00:00', horaTolerancia: '19:15:00', horaSalida: '22:00:00' },
  ];

  await prisma.turno.deleteMany();
  await prisma.turno.createMany({ data: turnos });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

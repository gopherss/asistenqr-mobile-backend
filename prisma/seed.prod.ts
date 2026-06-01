import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  const existing = await prisma.perfil.findUnique({
    where: { email: 'superadmin@asistenciaqr.com' },
  });

  if (existing) {
    console.log('Superadmin ya existe, omitiendo creación');
    return;
  }

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

  console.log('✓ Superadmin creado: superadmin@asistenciaqr.com / admin1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

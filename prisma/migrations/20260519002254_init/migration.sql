-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DIRECTOR', 'SUBDIRECTOR', 'DOCENTE', 'TERMINAL');

-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PUNTUAL', 'TARDE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'DOCENTE',
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "dni" TEXT,
    "telefono" TEXT,
    "turno_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hora_entrada" TEXT NOT NULL,
    "hora_tolerancia" TEXT NOT NULL,
    "hora_salida" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL,
    "docente_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" "EstadoAsistencia" NOT NULL,
    "metodo" TEXT NOT NULL DEFAULT 'qr',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

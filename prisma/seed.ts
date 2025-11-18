import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
declare const process: any;

async function main() {
  // Sucursales
  const sucursal = await prisma.sucursal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: "JM Barbería Centro",
      direccion: "Calle Falsa 123",
      apertura: "09:00",
      cierre: "20:00",
    },
  });

  // Barberos
  const juan = await prisma.barbero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: "Juan Manuel Sanchez",
      sucursalId: sucursal.id,
      activo: true,
    },
  });

  const nacho = await prisma.barbero.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: "Nacho Perez", sucursalId: sucursal.id, activo: true },
  });

  // Servicios
  await prisma.servicio.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: "Corte clásico", precio: 600, duracion: 30 },
  });

  await prisma.servicio.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: "Barba", precio: 400, duracion: 20 },
  });

  // Cliente de prueba
  await prisma.cliente.upsert({
    where: { telefono: "59899999999" },
    update: {},
    create: {
      nombre: "Cliente Demo",
      telefono: "59899999999",
      email: "demo@example.com",
    },
  });

  console.log("Seed finalizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import prisma from "../prisma";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { ReservaRepository } from "../repositories/ReservaRepository";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const clientRepo = new ClienteRepository();
  const reservaRepo = new ReservaRepository();

  // asegurate que exista el cliente seed telefono
  const cliente = await clientRepo.findByTelefono("59899999999");
  if (!cliente) {
    console.log("Cliente no encontrado");
    return;
  }

  const sucursal = await prisma.sucursal.findFirst();
  const barbero = await prisma.barbero.findFirst();
  const servicio = await prisma.servicio.findFirst();

  const inicio = new Date();
  inicio.setDate(inicio.getDate() + 1);
  inicio.setHours(11, 0, 0, 0);
  const fin = new Date(inicio);
  const duracion = servicio?.duracion ?? 30;
  fin.setMinutes(fin.getMinutes() + duracion);

  const reserva = await reservaRepo.createReserva({
    clienteId: cliente.id,
    sucursalId: sucursal!.id,
    barberoId: barbero!.id,
    fechaInicio: inicio,
    fechaFin: fin,
    precioTotal: servicio!.precio,
    codigoCancelacion: uuidv4(),
    servicioIds: [servicio!.id],
  });

  console.log("Reserva creada:", reserva);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import prisma from "../prisma";

export class ReservaRepository {
  async createReserva(data: {
    clienteId: number;
    sucursalId: number;
    barberoId: number;
    fechaInicio: Date;
    fechaFin: Date;
    precioTotal: number;
    codigoCancelacion: string;
    chatId?: string | null;
    servicioIds?: number[];
  }) {
    const { servicioIds = [], ...rest } = data;

    const reserva = await prisma.reserva.create({
      data: {
        ...rest,
        servicios: {
          create: servicioIds.map((sid) => ({
            servicio: { connect: { id: sid } },
          })),
        },
      },
      include: { servicios: { include: { servicio: true } } },
    });

    return reserva;
  }

  async findActiveByChatId(chatId: string) {
    return prisma.reserva.findFirst({
      where: { chatId, estado: "PENDIENTE" },
      orderBy: { fechaInicio: "asc" },
    });
  }

  async cancelById(id: number) {
    return prisma.reserva.update({
      where: { id },
      data: { estado: "CANCELADA" },
    });
  }

  async listByDate(sucursalId: number, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return prisma.reserva.findMany({
      where: { sucursalId, fechaInicio: { gte: start, lt: end } },
      include: {
        cliente: true,
        barbero: true,
        servicios: { include: { servicio: true } },
      },
    });
  }
}

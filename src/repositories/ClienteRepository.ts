import prisma from "../prisma";
import { ClienteDTO } from "../models/Cliente";

export class ClienteRepository {
  async findByTelefono(telefono: string) {
    return prisma.cliente.findUnique({ where: { telefono } });
  }

  async create(data: ClienteDTO) {
    return prisma.cliente.create({ data });
  }

  async findById(id: number) {
    return prisma.cliente.findUnique({ where: { id } });
  }
}

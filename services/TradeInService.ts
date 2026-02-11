import { prisma } from "../database/client";
import { TradeinInfoInput } from "../types";

export class TradeInService {
  async create(tradeInInfo: TradeinInfoInput) {
    return await prisma.tradeinInfo.create({ data: tradeInInfo });
  }

  async getById(id: number) {
    return await prisma.tradeinInfo.findUnique({ where: { id } });
  }

  async getAll() {
    return await prisma.tradeinInfo.findMany();
  }

  async delete(id: number) {
    return await prisma.tradeinInfo.delete({ where: { id } });
  }
}

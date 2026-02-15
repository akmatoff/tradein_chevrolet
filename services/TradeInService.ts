import { prisma } from "../database/client";
import { Photo, TradeinInfoInput } from "../types";

export class TradeInService {
  async create(tradeInInfo: TradeinInfoInput) {
    return await prisma.tradeinInfo.create({ data: tradeInInfo });
  }

  async savePhotos(infoId: number, photos: Photo[]) {
    if (!photos.length) return;

    await prisma.carPhoto.createMany({
      data: photos.map((photo) => ({
        path: photo.path,
        type: photo.type,
        tradeinInfoId: infoId,
      })),
    });
  }

  async getById(id: number) {
    return await prisma.tradeinInfo.findUnique({
      where: { id },
      include: { photos: true },
    });
  }

  async getAll() {
    return await prisma.tradeinInfo.findMany({
      include: {
        photos: true,
      },
    });
  }

  async delete(id: number) {
    return await prisma.tradeinInfo.delete({ where: { id } });
  }
}

import { Telegraf, Markup } from "telegraf";
import { Command } from "./Command";
import { BotContext } from "../bot/context";
import {
  FIELDS,
  LABELS,
  BUTTON_FIELDS,
  FIELD_VALUES,
  FIELD_LABELS,
  getValueLabel,
  validateField,
} from "../utils/fields";
import { message } from "telegraf/filters";
import { TradeInService } from "../services/TradeInService";
import { Photo, TradeinInfoInput } from "../types";
import {
  BodyType,
  DriveType,
  EngineType,
  SteeringWheelSide,
  TransmissionType,
} from "../generated/prisma/enums";
import { PHOTO_LABELS, PHOTO_TYPES } from "../utils/photo-fields";
import { join } from "node:path";
import { pipeline } from "stream/promises";
import { createWriteStream } from "node:fs";

export class AddCommand extends Command {
  private tradeInService: TradeInService;

  constructor(bot: Telegraf<BotContext>) {
    super(bot);

    this.tradeInService = new TradeInService();
  }

  handle(): void {
    this.bot.command("add", async (ctx) => {
      ctx.session = { formData: {}, photos: {}, currentPhotoType: undefined };

      await ctx.reply(
        "Заполните поля для формы по одному. Используйте команду: /cancel для отмены.",
      );

      await this.askNext(ctx);
    });

    this.bot.on(message("text"), async (ctx) => {
      if (!ctx.session?.formData) return;

      const input = ctx.message.text.trim();

      if (input === "cancel" || input === "/cancel") {
        delete ctx.session.formData;
        delete ctx.session.photos;
        delete ctx.session.currentPhotoType;

        await ctx.reply("❌ Отменено.");

        return;
      }

      if (ctx.session.photos && ctx.session.currentPhotoType) {
        await ctx.reply("📸 Пожалуйста, отправьте фото.");

        return;
      }

      const currentField = FIELDS.find(
        (f) => ctx.session!.formData![f] === undefined,
      );

      if (!currentField) return;

      if (BUTTON_FIELDS.has(currentField)) {
        await ctx.reply("Пожалуйста, выберите вариант из кнопок.");

        await this.askNext(ctx);

        return;
      }

      const result = validateField(currentField, input);

      if (!result.success) {
        await ctx.reply(`❌ ${result.message}\n\n${LABELS[currentField]}:`);
        return;
      }

      ctx.session.formData[currentField] = input;

      await this.askNext(ctx);
    });

    this.bot.action(/^(.+):(.+)$/, async (ctx) => {
      if (!ctx.session?.formData) return;

      const currentField = FIELDS.find(
        (f) => ctx.session!.formData![f] === undefined,
      );

      if (!currentField) return;

      const [, fieldName, value] = ctx.match;

      if (fieldName !== currentField) return;

      ctx.session.formData[fieldName] = value;

      await ctx.answerCbQuery();
      await this.askNext(ctx);
    });

    this.bot.on(message("photo"), async (ctx) => {
      if (!ctx.session!.photos || !ctx.session!.currentPhotoType) return;

      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const type = ctx.session.currentPhotoType;

      const filename = `${Date.now()}-${photo.file_unique_id}-${type}.jpg`;
      const absolutePath = join(process.cwd(), "uploads", "photos", filename);
      const relativePath = `uploads/photos/${filename}`;

      try {
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);

        const fileResponse = await fetch(fileLink.href);

        if (!fileResponse.ok || !fileResponse.body) {
          throw new Error("File not found");
        }

        await pipeline(fileResponse.body, createWriteStream(absolutePath));

        ctx.session.photos[type] = {
          path: relativePath,
          type,
          fileId: photo.file_id,
        };

        const currentIndex = PHOTO_TYPES.indexOf(type);

        const nextIndex = currentIndex + 1;

        if (nextIndex < PHOTO_TYPES.length) {
          ctx.session.currentPhotoType = PHOTO_TYPES[nextIndex];

          await ctx.reply(`✅ ${PHOTO_LABELS[type]} сохранена.`);

          await this.askNext(ctx);
        } else {
          await this.showFullSummary(ctx);

          await this.saveData(ctx);
        }
      } catch (e) {
        console.error("Photo save error:", e);

        await ctx.reply("❌ Ошибка при сохранении фото. Попробуйте снова.");
      }
    });

    this.bot.command("cancel", async (ctx) => {
      if (ctx.session?.formData) {
        delete ctx.session.formData;
        delete ctx.session.photos;
        delete ctx.session.currentPhotoType;

        await ctx.reply("❌ Отменено.");
      }
    });
  }

  private async saveData(ctx: BotContext) {
    try {
      const parsedData = this.parseFormData(ctx.session!.formData!);

      const record = await this.tradeInService.create(parsedData);

      const photoRecords = Object.values(ctx.session?.photos || {});

      await this.tradeInService.savePhotos(record.id, photoRecords);

      await ctx.reply(`✅ Запись сохранена! ID: ${record.id}`);
    } catch (e) {
      console.error("Save error:", e);

      await ctx.reply("❌ Ошибка при сохранении.");
    } finally {
      delete ctx.session?.formData;
      delete ctx.session?.photos;
      delete ctx.session?.currentPhotoType;
    }
  }

  private async askNext(ctx: BotContext) {
    if (ctx.session?.photos && ctx.session.currentPhotoType) {
      const type = ctx.session.currentPhotoType;

      await ctx.reply(`${PHOTO_LABELS[type]}:`);

      return;
    }

    const nextField = FIELDS.find(
      (f) => ctx.session!.formData![f] === undefined,
    );

    if (!nextField) {
      ctx.session!.currentPhotoType = "FRONT";

      await ctx.reply(
        "✅ Текстовые поля заполнены!\n\nТеперь отправьте фото по порядку:",
      );
      await this.askNext(ctx);

      return;
    }

    if (BUTTON_FIELDS.has(nextField)) {
      const values = FIELD_VALUES[nextField as keyof typeof FIELD_VALUES];

      const labels = FIELD_LABELS[nextField as keyof typeof FIELD_LABELS];

      const buttons = values.map((v) =>
        Markup.button.callback(
          labels[v as keyof typeof labels],
          `${nextField}:${v}`,
        ),
      );

      await ctx.reply(
        `${LABELS[nextField]}:`,
        Markup.inlineKeyboard(buttons, { columns: 2 }),
      );
    } else {
      await ctx.reply(`${LABELS[nextField]}:`);
    }
  }

  private async showFullSummary(ctx: BotContext) {
    let textSummary = "📋 Отправляю результаты:\n\n";

    const filteredFields = FIELDS.filter(
      (field) => !["clientPhone", "clientName"].includes(field),
    );

    for (const field of filteredFields) {
      const value = ctx.session!.formData![field];

      if (value !== undefined) {
        const displayValue = getValueLabel(field, value);
        textSummary += `${LABELS[field]}: ${displayValue}\n`;
      }
    }

    console.log(
      `textSummary: \n${textSummary}\n__________________________________________________`,
    );

    await ctx.reply(textSummary);

    const photos = ctx.session?.photos || {};

    const fileIds = PHOTO_TYPES.map((type) => photos[type]!.fileId).filter(
      Boolean,
    ) as string[];

    if (fileIds.length > 0) {
      try {
        await ctx.replyWithMediaGroup(
          fileIds.map((fileId) => ({
            type: "photo",
            media: fileId,
          })),
        );
      } catch (error) {
        for (const [_, fileId] of fileIds.entries()) {
          await ctx.replyWithPhoto(fileId);
        }
      }
    }
  }

  private parseFormData(formData: Record<string, string>): TradeinInfoInput {
    return {
      manager: formData.manager,
      carBrand: formData.carBrand,
      carModel: formData.carModel,
      productionYear: parseInt(formData.productionYear),
      engineVolume: parseInt(formData.engineVolume),
      engineType: formData.engineType as EngineType,
      transmission: formData.transmission as TransmissionType,
      drive: formData.drive as DriveType,
      mileage: parseInt(formData.mileage),
      bodyType: formData.bodyType as BodyType,
      steeringWheelSide: formData.steeringWheelSide as SteeringWheelSide,
      vinCode: formData.vinCode,
      carCondition: formData.carCondition,
      hasRestrictions: formData.hasRestrictions === "true",
      price: parseInt(formData.price),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      comment: formData.comment,
    };
  }
}

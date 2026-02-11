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
  FieldName,
  validateField,
} from "../utils/fields";
import { message } from "telegraf/filters";
import { TradeInService } from "../services/TradeInService";
import { TradeinInfoInput } from "../types";
import {
  BodyType,
  DriveType,
  EngineType,
  SteeringWheelSide,
  TransmissionType,
} from "../generated/prisma/enums";

export class AddCommand extends Command {
  private tradeInService: TradeInService;

  constructor(bot: Telegraf<BotContext>) {
    super(bot);

    this.tradeInService = new TradeInService();
  }

  handle(): void {
    this.bot.command("add", async (ctx) => {
      ctx.session = { formData: {} };
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
        await ctx.reply("❌ Отменено.");
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

    this.bot.command("cancel", async (ctx) => {
      if (ctx.session?.formData) {
        delete ctx.session.formData;
        await ctx.reply("❌ Отменено.");
      }
    });
  }

  private async askNext(ctx: BotContext) {
    const nextField = FIELDS.find(
      (f) => ctx.session!.formData![f] === undefined,
    );

    if (!nextField) {
      try {
        const parsedData = this.parseFormData(ctx.session!.formData!);
        await this.summary(ctx, ctx.session!.formData!);

        const record = await this.tradeInService.create(parsedData);

        await ctx.reply(`Запись сохранена! ID: ${record.id}`);
      } catch (e) {
        console.error("Save error: ", e);
        await ctx.reply(
          "❌ Ошибка при сохранении данных. Пожалуйста, попробуйте заново.",
        );
      } finally {
        delete ctx.session.formData;
      }

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

  private async summary(ctx: BotContext, formData: Record<string, string>) {
    let result = "";

    await ctx.reply("📋 Отправляю результаты!");

    for (const field in formData) {
      const value = formData[field];
      if (value === undefined) continue;

      result += `${LABELS[field as keyof typeof LABELS]}: ${getValueLabel(field as FieldName, value)}\n`;
    }

    await ctx.reply(result);
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

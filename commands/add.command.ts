// src/commands/add.command.ts
import { Telegraf, Markup } from "telegraf";
import { Command } from "./Command";
import { BotContext } from "../bot/context";
import {
  FIELDS,
  LABELS,
  BUTTON_FIELDS,
  FIELD_VALUES,
  FIELD_LABELS,
} from "../utils/fields";
import { message } from "telegraf/filters";

export class AddCommand extends Command {
  constructor(bot: Telegraf<BotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.command("add", async (ctx) => {
      ctx.session = { formData: {} };
      await ctx.reply("Заполнение формы начато. Отмена: /cancel");
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
      await ctx.reply("✅ Форма завершена!");

      delete ctx.session?.formData;
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
}

import "dotenv/config";

import { Context, session, Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";
import { getNextQuestion } from "./bot/helpers.js";
import { CarFormData, Field, FIELDS, LABELS } from "./bot/fields.js";

interface SessionData {
  formData?: CarFormData;
}

type BotContext = Context & { session: SessionData };

const bot = new Telegraf<BotContext>(BOT_TOKEN);

bot.use(session());

bot.command("add", async (ctx) => {
  if (!ctx.session) {
    ctx.session = {};
  }

  ctx.reply("Я запрошу у вас поля для заполнения по порядку.\n");

  ctx.session.formData = {};
  const question = getNextQuestion(ctx.session.formData);
  if (question) {
    await ctx.reply(question);
  } else {
    await ctx.reply("Все поля заполнены успешно!");
  }
});

bot.on("text", async (ctx) => {
  const input = ctx.message.text.trim();
  const lowerInput = input.toLowerCase();

  if (lowerInput === "cancel" || lowerInput === "/cancel") {
    if (ctx.session?.formData) {
      delete ctx.session.formData;
      await ctx.reply("❌ Отменено. Начните заново с /add.");
    } else {
      await ctx.reply("Нет активной формы.");
    }
    return;
  }

  if (!ctx.session?.formData) {
    await ctx.reply("Используйте /add чтобы начать заполнение.");
    return;
  }

  const formData = ctx.session.formData;

  let nextField: Field | null = null;
  for (const field of FIELDS) {
    if (formData[field] === undefined) {
      nextField = field;
      break;
    }
  }

  if (!nextField) {
    await ctx.reply("✅ Все данные собраны! Спасибо.");
    delete ctx.session.formData;

    return;
  }

  formData[nextField] = ctx.message.text.trim();

  const nextQuestion = getNextQuestion(formData);
  if (nextQuestion) {
    await ctx.reply(nextQuestion);
  } else {
    await ctx.reply("✅ Форма завершена!");

    const summary: Record<string, string | number | boolean> = {};

    if (formData) {
      Object.entries(formData)
        .filter(([key, value]) => !["clientPhone", "clientName"].includes(key))
        .forEach(([key, value]) => {
          console.log(`${LABELS[key as Field]}: ${value}`);
          summary[LABELS[key as Field]] = value;
        });
    }

    ctx.reply(`
      ${Object.entries(summary)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")}
      `);

    delete ctx.session.formData;
  }
});

async function init() {
  await bot.telegram.setMyCommands([
    { command: "/add", description: "Добавить запись" },
    { command: "/start", description: "Запустить бота" },
    { command: "/cancel", description: "Отменить заполнение" },
  ]);

  bot.start((ctx) => {
    console.log("Bot started");
    ctx.reply("Добро пожаловать в Trade-in Chevrolet!");
  });
  bot.launch();
}

init();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

import { Telegraf } from "telegraf";
import { Command } from "./Command";
import { BotContext } from "../bot/context";

export class StartCommand extends Command {
  constructor(bot: Telegraf<BotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply("Добро пожаловать в Trade-in Chevrolet!");
    });
  }
}

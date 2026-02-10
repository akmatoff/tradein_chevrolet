import { session, Telegraf } from "telegraf";
import { BOT_TOKEN } from "../env";
import { BotContext } from "./context";
import { Command } from "../commands/Command";
import { StartCommand } from "../commands/start.command";
import { AddCommand } from "../commands/add.command";

export class Bot {
  bot: Telegraf<BotContext>;
  commands: Command[] = [];

  constructor() {
    this.bot = new Telegraf<BotContext>(BOT_TOKEN);
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.bot.use(session());
  }

  init() {
    this.commands = [new StartCommand(this.bot), new AddCommand(this.bot)];

    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch(() => console.log("Bot is running..."));
  }

  stop() {
    this.bot.stop();
  }
}

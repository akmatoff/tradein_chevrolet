import { Telegraf } from "telegraf";
import { BotContext } from "../bot/context";

export abstract class Command {
  constructor(public bot: Telegraf<BotContext>) {}

  abstract handle(): void;
}

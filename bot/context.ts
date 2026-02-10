import { Context } from "telegraf";
import { FieldName } from "../utils/fields";

export interface SessionData {
  formData?: Partial<Record<FieldName, string>>;
  currentFieldIndex?: number;
}

export interface BotContext extends Context {
  session: SessionData;
}

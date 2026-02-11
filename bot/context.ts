import { Context } from "telegraf";
import { FieldName } from "../utils/fields";
import { PhotoType } from "../utils/photo-fields";

export interface SessionData {
  formData?: Partial<Record<FieldName, string>>;
  photos?: Partial<Record<PhotoType, string>>;
  currentPhotoType?: PhotoType;
}

export interface BotContext extends Context {
  session: SessionData;
}

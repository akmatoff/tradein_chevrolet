import { Context } from "telegraf";
import { FieldName } from "../utils/fields";
import { PhotoType } from "../utils/photo-fields";

export type PhotoSession = {
  path: string;
  type: PhotoType;
  fileId: string;
};

export interface SessionData {
  formData?: Partial<Record<FieldName, string>>;
  photos?: Partial<Record<PhotoType, PhotoSession>>;
  currentPhotoType?: PhotoType;
}

export interface BotContext extends Context {
  session: SessionData;
}

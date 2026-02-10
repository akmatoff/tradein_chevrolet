import { Markup } from "telegraf";
import { BooleanField, EnumField, Field, TextField } from "./fields";
import {
  BodyType,
  DriveType,
  EngineType,
  SteeringWheelSide,
  TransmissionType,
} from "../generated/prisma/enums";

const createEnumField = <T extends string>(
  name: string,
  label: string,
  values: T[],
): EnumField<string> => ({
  name,
  label,
  type: "enum",
  options: values,
  ask: async (ctx) => {
    const buttons = values.map((v) =>
      Markup.button.callback(v, `${name}:${v}`),
    );

    await ctx.reply(
      `${label}: `,
      Markup.inlineKeyboard(buttons, { columns: 2 }),
    );
  },
});

const createTextField = (name: string, label: string): TextField => ({
  name,
  label,
  type: "text",
  ask: async (ctx) => {
    await ctx.reply(`${label}:`);
  },
});

const createBooleanField = (name: string, label: string): BooleanField => ({
  name,
  label,
  type: "boolean",
  ask: async (ctx) => {
    await ctx.reply(
      `${label}:`,
      Markup.inlineKeyboard([
        Markup.button.callback("Да", `${name}:true`),
        Markup.button.callback("Нет", `${name}:false`),
      ]),
    );
  },
});

export const TRADEIN_FIELDS: Field[] = [
  createTextField("manager", "👤 Менеджер"),
  createTextField("carBrand", "🚗 Марка"),
  createTextField("carModel", "modele Модель"),
  createTextField("productionYear", "📅 Год выпуска"),
  createTextField("engineVolume", "🛢️ Объем двигателя (л)"),
  createEnumField("engineType", "⛽ Тип двигателя", Object.values(EngineType)),
  createEnumField(
    "transmission",
    "🔄 Коробка передач",
    Object.values(TransmissionType),
  ),
  createEnumField("drive", "🚙 Привод", Object.values(DriveType)),
  createTextField("mileage", "🛣️ Пробег (км)"),
  createEnumField("bodyType", "🏠 Тип кузова", Object.values(BodyType)),
  createEnumField(
    "steeringWheelSide",
    "🧭 Сторона руля",
    Object.values(SteeringWheelSide),
  ),
  createTextField("vinCode", "🔖 VIN (17 символов)"),
  createTextField("carCondition", "🔧 Состояние авто"),
  createBooleanField("hasRestrictions", "⚠️ Есть ограничения?"),
  createTextField("price", "💰 Цена"),
  createTextField("clientName", "📛 ФИО клиента"),
  createTextField("clientPhone", "📱 Телефон клиента"),
  createTextField("comment", "💬 Комментарий"),
];

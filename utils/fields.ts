import { BotContext } from "../bot/context";
import { z } from "zod";

type BaseField = {
  name: string;
  label: string;
};

export type TextField = BaseField & {
  type: "text";
  ask: (ctx: BotContext) => Promise<void>;
};

export type EnumField<T extends string> = BaseField & {
  type: "enum";
  options: T[];
  ask: (ctx: BotContext) => Promise<void>;
};

export type BooleanField = BaseField & {
  type: "boolean";
  ask: (ctx: BotContext) => Promise<void>;
};

export type Field = TextField | EnumField<string> | BooleanField;

export const FIELDS = [
  "manager",
  "carBrand",
  "carModel",
  "productionYear",
  "engineVolume",
  "engineType",
  "transmission",
  "drive",
  "mileage",
  "bodyType",
  "steeringWheelSide",
  "vinCode",
  "carCondition",
  "hasRestrictions",
  "price",
  "clientName",
  "clientPhone",
  "comment",
] as const;

export type FieldName = (typeof FIELDS)[number];

export const LABELS: Record<FieldName, string> = {
  manager: "👤 Менеджер",
  carBrand: "🚗 Марка",
  carModel: "🚘 Модель",
  productionYear: "📅 Год выпуска",
  engineVolume: "🛢️ Объем двигателя (л)",
  engineType: "⛽ Тип двигателя",
  transmission: "🔄 Коробка передач",
  drive: "🚙 Привод",
  mileage: "🛣️ Пробег (км)",
  bodyType: "🛻 Тип кузова",
  steeringWheelSide: "🧭 Сторона руля",
  vinCode: "🔖 VIN (17 символов)",
  carCondition: "🔧 Состояние авто",
  hasRestrictions: "⚠️ Есть ограничения? (кредит/арест/залог)",
  price: "💰 Цена (сом)",
  clientName: "📛 ФИО клиента",
  clientPhone: "📱 Телефон клиента",
  comment: "💬 Комментарий",
};

export const BUTTON_FIELDS = new Set<FieldName>([
  "engineType",
  "transmission",
  "drive",
  "steeringWheelSide",
  "hasRestrictions",
  "bodyType",
  "carCondition",
]);

export const FIELD_VALUES = {
  engineType: ["PETROL", "DIESEL", "GAS", "HYBRID", "PETROL_GAS"] as const,
  bodyType: [
    "SEDAN",
    "HATCHBACK",
    "UNIVERSAL",
    "COUPE",
    "SUV",
    "CROSSOVER",
    "MINIVAN",
  ] as const,
  transmission: ["AUTOMATIC", "MECHANIC", "ROBOTIC"] as const,
  drive: ["FRONT", "REAR", "FULL"] as const,
  steeringWheelSide: ["LEFT", "RIGHT"] as const,
  hasRestrictions: ["true", "false"] as const,
  carCondition: ["ONE", "TWO", "THREE", "FOUR", "FIVE"] as const,
} as const;

export const FIELD_LABELS = {
  engineType: {
    PETROL: "Бензин",
    DIESEL: "Дизель",
    GAS: "Газ",
    HYBRID: "Гибрид",
    PETROL_GAS: "Бензин+Газ",
  },
  transmission: {
    AUTOMATIC: "Автомат",
    MECHANIC: "Механика",
    ROBOTIC: "Робот",
  },
  drive: {
    FRONT: "Передний",
    REAR: "Задний",
    FULL: "Полный",
  },
  steeringWheelSide: {
    LEFT: "Левая",
    RIGHT: "Правая",
  },
  hasRestrictions: {
    true: "Да",
    false: "Нет",
  },
  bodyType: {
    SEDAN: "Седан",
    HATCHBACK: "Хетчбэк",

    UNIVERSAL: "Универсал",
    COUPE: "Купе",
    SUV: "SUV",
    CROSSOVER: "Кроссовер",
    MINIVAN: "Минивэн",
  },
  carCondition: {
    ONE: "⭐",
    TWO: "⭐⭐",
    THREE: "⭐⭐⭐",
    FOUR: "⭐⭐⭐⭐",
    FIVE: "⭐⭐⭐⭐⭐",
  },
} as const;

export const fieldSchemas = {
  manager: z
    .string({ error: "Значение для менеджера не корректно" })
    .min(1, "Менеджер не может быть пустым"),
  carBrand: z.string().min(1, "Марка не может быть пустой"),
  carModel: z.string().min(1, "Модель не может быть пустой"),
  productionYear: z.coerce
    .number("Пожалуйста, введите число")
    .int("Пожалуйста, введите целое число")
    .positive("Год выпуска должен быть положительным"),
  engineVolume: z.coerce
    .number("Пожалуйста, введите число")
    .positive("Объем двигателя должен быть положительным"),
  engineType: z.enum(FIELD_VALUES.engineType),
  transmission: z.enum(FIELD_VALUES.transmission),
  drive: z.enum(FIELD_VALUES.drive),
  mileage: z.coerce
    .number("Пожалуйста, введите число")
    .int("Пожалуйста, введите целое число")
    .nonnegative("Пробег не может быть отрицательным"),
  bodyType: z.enum(FIELD_VALUES.bodyType),
  steeringWheelSide: z.enum(FIELD_VALUES.steeringWheelSide),
  vinCode: z.string().length(17, "VIN должен быть ровно 17 символов"),
  carCondition: z.enum(FIELD_VALUES.carCondition),
  hasRestrictions: z.enum(["true", "false"] as const),
  price: z.coerce
    .number("Пожалуйста, введите число")
    .nonnegative("Цена не может быть отрицательной"),
  clientName: z.string().min(3, "ФИО клиента обязательно"),
  clientPhone: z
    .string()
    .min(9, "Пожалуйста, введите корректный номер телефона"),
  comment: z.string().optional(),
} as const;

export type EngineType = (typeof FIELD_VALUES.engineType)[number];
export type TransmissionType = (typeof FIELD_VALUES.transmission)[number];
export type DriveType = (typeof FIELD_VALUES.drive)[number];
export type SteeringWheelSide = (typeof FIELD_VALUES.steeringWheelSide)[number];
export type BodyType = (typeof FIELD_VALUES.bodyType)[number];
export type CarCondition = (typeof FIELD_VALUES.carCondition)[number];

export function getValueLabel(field: FieldName, value: string): string {
  if (!BUTTON_FIELDS.has(field)) {
    return value;
  }

  const labels = FIELD_LABELS[field as keyof typeof FIELD_LABELS];
  return labels[value as keyof typeof labels] || value;
}

export function validateField(field: FieldName, value: string) {
  const schema = fieldSchemas[field];
  try {
    schema.parse(value);
    return { success: true as const };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false as const, message: err.issues[0].message };
    }
    return { success: false as const, message: "Неверный формат" };
  }
}

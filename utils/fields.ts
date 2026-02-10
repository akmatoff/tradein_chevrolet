import { BotContext } from "../bot/context";

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
  bodyType: "🏠 Тип кузова",
  steeringWheelSide: "🧭 Сторона руля",
  vinCode: "🔖 VIN (17 символов)",
  carCondition: "🔧 Состояние авто",
  hasRestrictions: "⚠️ Есть ограничения? (кредит/арест/залог)",
  price: "💰 Цена",
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
} as const;

export type EngineType = (typeof FIELD_VALUES.engineType)[number];
export type TransmissionType = (typeof FIELD_VALUES.transmission)[number];
export type DriveType = (typeof FIELD_VALUES.drive)[number];
export type SteeringWheelSide = (typeof FIELD_VALUES.steeringWheelSide)[number];
export type BodyType = (typeof FIELD_VALUES.bodyType)[number];

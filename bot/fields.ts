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

export type Field = (typeof FIELDS)[number];
export type CarFormData = Partial<Record<Field, string | number | boolean>>;

export const LABELS: Record<Field, string> = {
  manager: "Менеджер",
  carBrand: "Марка",
  carModel: "Модель",
  productionYear: "Год выпуска",
  engineVolume: "Объем двигателя",
  engineType: "Тип двигателя",
  transmission: "Коробка передач",
  drive: "Привод",
  mileage: "Пробег",
  bodyType: "Тип кузова",
  steeringWheelSide: "Сторона руля",
  vinCode: "VIN код",
  carCondition: "Состояние автомобиля",
  hasRestrictions: "Есть ли ограничения?",
  price: "Цена",
  clientName: "Ф.И.О клиента",
  clientPhone: "Телефон клиента",
  comment: "Комментарий",
};

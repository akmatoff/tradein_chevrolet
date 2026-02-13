import {
  BodyType,
  DriveType,
  EngineType,
  SteeringWheelSide,
  TransmissionType,
} from "./generated/prisma/enums";

export type TradeinInfo = {
  id: number;
  manager: string;
  carBrand: string;
  carModel: string;
  productionYear: number;
  engineVolume: number;
  engineType: EngineType;
  transmission: TransmissionType;
  drive: DriveType;
  mileage: number;
  bodyType: BodyType;
  steeringWheelSide: SteeringWheelSide;
  vinCode: string;
  carCondition: string;
  hasRestrictions: boolean;
  price: number;
  clientName: string;
  clientPhone: string;
  comment: string;
  createdAt: string;
};

export type TradeinInfoInput = Omit<TradeinInfo, "id" | "createdAt">;

export type TradeInfoOutput = Omit<
  TradeinInfo,
  "clientPhone" | "clientName" | "id" | "createdAt"
>;

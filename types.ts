import {
  DriveType,
  EngineType,
  SteeringWheelSide,
  TransmissionType,
} from "./generated/prisma/enums";
import { Context as TelegrafContext } from "telegraf";
import type { Message as TGMessage } from "telegraf/types";

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
  bodyType: string;
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

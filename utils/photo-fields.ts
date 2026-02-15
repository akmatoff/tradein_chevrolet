export const PHOTO_TYPES = [
  "FRONT",
  "LEFT",
  "RIGHT",
  "REAR",
  "SALON_FRONT",
  "SALON_REAR",
  "UNDER_HOOD",
] as const;

export type PhotoType = (typeof PHOTO_TYPES)[number];

export const PHOTO_LABELS: Record<PhotoType, string> = {
  FRONT: "📸 Фотография спереди",
  LEFT: "📸 Фотография слева",
  RIGHT: "📸 Фотография справа",
  REAR: "📸 Фотография сзади",
  SALON_FRONT: "📸 Фотография салона спереди",
  SALON_REAR: "📸 Фотография салона сзади",
  UNDER_HOOD: "📸 Фотография подкапотного пространства",
};

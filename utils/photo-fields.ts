export const PHOTO_TYPES = ["front", "left", "right", "rear"] as const;

export type PhotoType = (typeof PHOTO_TYPES)[number];

export const PHOTO_LABELS: Record<PhotoType, string> = {
  front: "📸 Фотография спереди",
  left: "📸 Фотография слева",
  right: "📸 Фотография справа",
  rear: "📸 Фотография сзади",
};

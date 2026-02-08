import { CarFormData, FIELDS, LABELS } from "./fields";

export function getNextQuestion(formData: CarFormData): string | null {
  for (const field of FIELDS) {
    if (formData[field] === undefined) {
      return `${LABELS[field]}: `;
    }
  }

  return null;
}

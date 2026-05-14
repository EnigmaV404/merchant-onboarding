import { MerchantCategory } from "@/types/domain";

export const merchantCategories: Array<{
  key: MerchantCategory;
  label: string;
  slaBusinessDays: number;
}> = [
  { key: "RETAIL", label: "Retail", slaBusinessDays: 3 },
  { key: "FOOD_AND_BEVERAGE", label: "Food and Beverage", slaBusinessDays: 4 },
  { key: "DIGITAL_SERVICES", label: "Digital Services", slaBusinessDays: 3 }
];

export const baselineChecklistTemplates = [
  {
    category: "RETAIL",
    items: ["Owner identity proof", "GST or tax registration", "Bank account verification", "Operating address verification"]
  },
  {
    category: "FOOD_AND_BEVERAGE",
    items: ["Owner identity proof", "FSSAI license", "Bank account verification", "Operating address verification"]
  },
  {
    category: "DIGITAL_SERVICES",
    items: ["Owner identity proof", "Digital presence verification", "Service category declaration", "Bank account verification"]
  }
] as const;

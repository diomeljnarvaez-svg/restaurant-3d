const dietKeywords: { label: string; keywords: string[]; color: string }[] = [
  { label: "vegan", keywords: ["vegano", "vegan", "plant-based", "vegetal"], color: "#10B981" },
  { label: "vegetarian", keywords: ["vegetariano", "vegetarian", "veggie"], color: "#22C55E" },
  { label: "glutenFree", keywords: ["sin gluten", "gluten free", "gluten-free", "celiaco"], color: "#F59E0B" },
  { label: "lactoseFree", keywords: ["sin lactosa", "lactose free", "lactose-free"], color: "#3B82F6" },
  { label: "spicy", keywords: ["picante", "spicy", "aji", "chile"], color: "#EF4444" },
  { label: "organic", keywords: ["organico", "orgánico", "organic"], color: "#8B5CF6" },
];

export function detectDietaryBadges(name: string, description: string): { label: string; color: string }[] {
  const text = (name + " " + description).toLowerCase();
  return dietKeywords
    .filter(d => d.keywords.some(k => text.includes(k)))
    .map(d => ({ label: d.label, color: d.color }));
}

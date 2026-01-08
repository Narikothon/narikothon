import { authors, categories } from "./taxonomy";

export function authorSlug(name: string): string {
	return authors[name] || name;
}

export function categorySlug(name: string): string {
	return categories[name] || name;
}

export function getAuthorName(slug: string): string | undefined {
	return Object.keys(authors).find(key => authors[key] === slug);
}

export function getCategoryName(slug: string): string | undefined {
	return Object.keys(categories).find(key => categories[key] === slug);
}


import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Generate a unique slug from Bengali text
// Since we can't easily transliterate Bengali, we'll create a hash-based slug
function generateReadableSlug(bengaliText: string): string {
	// Create a simple hash from the text
	let hash = 0;
	for (let i = 0; i < bengaliText.length; i++) {
		const char = bengaliText.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	// Convert to positive number and base36 for shorter slugs
	const hashStr = Math.abs(hash).toString(36);
	
	// Try to extract any English words or numbers from the text
	const englishMatch = bengaliText.match(/[a-zA-Z0-9]+/g);
	if (englishMatch && englishMatch.length > 0) {
		const englishPart = englishMatch.join('-').toLowerCase();
		return `${englishPart}-${hashStr.substring(0, 6)}`;
	}
	
	// Fallback: use hash with a prefix - ensure it's unique by using full hash
	return `slug-${hashStr}`;
}

async function generateTaxonomy() {
	const blogDir = join(process.cwd(), 'content');
	const taxonomyFile = join(process.cwd(), 'src/lib/taxonomy.ts');
	
	// Read existing taxonomy
	let existingAuthors: Record<string, string> = {};
	let existingCategories: Record<string, string> = {};
	
	try {
		const taxonomyContent = await readFile(taxonomyFile, 'utf-8');
		// Extract existing authors
		const authorsMatch = taxonomyContent.match(/export const authors[^=]*=\s*\{([^}]+)\}/s);
		if (authorsMatch) {
			const authorsContent = authorsMatch[1];
			const authorMatches = authorsContent.matchAll(/"([^"]+)":\s*"([^"]+)"/g);
			for (const match of authorMatches) {
				existingAuthors[match[1]] = match[2];
			}
		}
		// Extract existing categories
		const categoriesMatch = taxonomyContent.match(/export const categories[^=]*=\s*\{([^}]+)\}/s);
		if (categoriesMatch) {
			const categoriesContent = categoriesMatch[1];
			const categoryMatches = categoriesContent.matchAll(/"([^"]+)":\s*"([^"]+)"/g);
			for (const match of categoryMatches) {
				existingCategories[match[1]] = match[2];
			}
		}
	} catch (error) {
		console.log('No existing taxonomy found, creating new one...');
	}
	
	// Read all blog posts
	const files = await readdir(blogDir);
	const mdFiles = files.filter(f => f.endsWith('.md'));
	
	const authors = new Set<string>();
	const categories = new Set<string>();
	
	// Extract authors and categories from all posts
	for (const file of mdFiles) {
		const content = await readFile(join(blogDir, file), 'utf-8');
		const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
		
		if (frontmatter) {
			const fm = frontmatter[1];
			
			// Extract author
			const authorMatch = fm.match(/^author:\s*["']?([^"'\n]+)["']?/m);
			if (authorMatch && authorMatch[1]) {
				const author = authorMatch[1].trim();
				if (author) {
					authors.add(author);
				}
			}
			
			// Extract categories
			const categoriesMatch = fm.match(/^categories:\s*\n((?:\s*-\s*["'][^"']+["']\n?)+)/m);
			if (categoriesMatch) {
				const categoryLines = categoriesMatch[1].matchAll(/-\s*["']([^"']+)["']/g);
				for (const match of categoryLines) {
					const category = match[1].trim();
					if (category) {
						categories.add(category);
					}
				}
			}
		}
	}
	
	// Merge with existing taxonomy (keep existing slugs, add new ones)
	const allAuthors: Record<string, string> = { ...existingAuthors };
	const allCategories: Record<string, string> = { ...existingCategories };
	
	// Add missing authors
	for (const author of authors) {
		if (!allAuthors[author]) {
			allAuthors[author] = generateReadableSlug(author);
		}
	}
	
	// Add missing categories
	for (const category of categories) {
		if (!allCategories[category]) {
			allCategories[category] = generateReadableSlug(category);
		}
	}
	
	// Sort alphabetically by key
	const sortedAuthors = Object.keys(allAuthors)
		.sort((a, b) => a.localeCompare(b))
		.reduce((acc, key) => {
			acc[key] = allAuthors[key];
			return acc;
		}, {} as Record<string, string>);
	
	const sortedCategories = Object.keys(allCategories)
		.sort((a, b) => a.localeCompare(b))
		.reduce((acc, key) => {
			acc[key] = allCategories[key];
			return acc;
		}, {} as Record<string, string>);
	
	// Generate taxonomy.ts content
	const authorsEntries = Object.entries(sortedAuthors)
		.map(([key, value]) => `\t"${key}": "${value}"`)
		.join(',\n');
	
	const categoriesEntries = Object.entries(sortedCategories)
		.map(([key, value]) => `\t"${key}": "${value}"`)
		.join(',\n');
	
	const taxonomyContent = `export const authors: Record<string, string> = {
${authorsEntries}
};

export const categories: Record<string, string> = {
${categoriesEntries}
};
`;
	
	// Write to file
	await writeFile(taxonomyFile, taxonomyContent, 'utf-8');
	
	console.log('✅ Taxonomy generated successfully!');
	console.log(`\n📝 Found ${Object.keys(sortedAuthors).length} authors (${Object.keys(existingAuthors).length} existing, ${Object.keys(sortedAuthors).length - Object.keys(existingAuthors).length} new)`);
	console.log(`📝 Found ${Object.keys(sortedCategories).length} categories (${Object.keys(existingCategories).length} existing, ${Object.keys(sortedCategories).length - Object.keys(existingCategories).length} new)`);
	console.log(`\n📄 Updated: ${taxonomyFile}`);
	console.log('\n⚠️  Please review the generated slugs and update them if needed!');
}

generateTaxonomy().catch(console.error);


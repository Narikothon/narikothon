import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { authors, categories } from '../src/lib/taxonomy.js';

async function validateTaxonomy() {
	const blogDir = join(process.cwd(), 'src/content/blog');
	const files = await readdir(blogDir);
	const mdFiles = files.filter(f => f.endsWith('.md'));
	
	const missingAuthors = new Set<string>();
	const missingCategories = new Set<string>();
	
	// Check all posts for missing authors and categories
	for (const file of mdFiles) {
		const content = await readFile(join(blogDir, file), 'utf-8');
		const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
		
		if (frontmatter) {
			const fm = frontmatter[1];
			
			// Extract author
			const authorMatch = fm.match(/^author:\s*["']?([^"'\n]+)["']?/m);
			if (authorMatch && authorMatch[1]) {
				const author = authorMatch[1].trim();
				if (author && !authors[author]) {
					missingAuthors.add(author);
				}
			}
			
			// Extract categories
			const categoriesMatch = fm.match(/^categories:\s*\n((?:\s*-\s*["'][^"']+["']\n?)+)/m);
			if (categoriesMatch) {
				const categoryLines = categoriesMatch[1].matchAll(/-\s*["']([^"']+)["']/g);
				for (const match of categoryLines) {
					const category = match[1].trim();
					if (category && !categories[category]) {
						missingCategories.add(category);
					}
				}
			}
		}
	}
	
	if (missingAuthors.size === 0 && missingCategories.size === 0) {
		console.log('✅ All authors and categories are in taxonomy!');
		return;
	}
	
	// Create issue body
	const issueBody = `# Missing Taxonomy Entries

## Missing Authors
${Array.from(missingAuthors).map(author => `- [ ] \`"${author}": "slug-here"\``).join('\n')}

## Missing Categories
${Array.from(missingCategories).map(category => `- [ ] \`"${category}": "slug-here"\``).join('\n')}

Please add these entries to \`src/lib/taxonomy.ts\`.
`;

	console.error('❌ Missing taxonomy entries found!');
	console.error('\n' + issueBody);
	
	// Try to create GitHub issue if in CI environment
	// GITHUB_REPOSITORY is automatically available in GitHub Actions
	const githubRepo = process.env.GITHUB_REPOSITORY;
	if (process.env.GITHUB_TOKEN && githubRepo) {
		try {
			const [owner, repo] = githubRepo.split('/');
			const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
					'Accept': 'application/vnd.github.v3+json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: `Missing Taxonomy Entries: ${missingAuthors.size} authors, ${missingCategories.size} categories`,
					body: issueBody,
					labels: ['taxonomy', 'bug'],
				}),
			});
			
			if (response.ok) {
				const issue = await response.json();
				console.log(`✅ Created GitHub issue: ${issue.html_url}`);
			} else {
				const errorText = await response.text();
				console.error('Failed to create GitHub issue:', response.status, errorText);
			}
		} catch (error) {
			console.error('Error creating GitHub issue:', error);
		}
	}
	
	// Exit with error code
	process.exit(1);
}

validateTaxonomy();

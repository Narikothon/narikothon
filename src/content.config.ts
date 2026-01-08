import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.preprocess(
			(data: any) => {
				if (data?.coverImage && typeof data.coverImage === 'string' && !data.coverImage.includes('/')) {
					data.coverImage = `./${data.coverImage}`;
				}
				return data;
			},
		z.object({
			title: z.string(),
				// Support both 'date' and 'pubDate' formats
				date: z.coerce.date().optional(),
				pubDate: z.coerce.date().optional(),
			description: z.string().optional(),
				categories: z.array(z.string()).optional(),
				// coverImage uses image() helper, path should be relative to content directory
				coverImage: image().optional(),
				author: z.string().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			}).transform((data) => {
				// If 'date' is provided but 'pubDate' is not, use date as pubDate
				let transformed = data;
				if (data.date && !data.pubDate) {
					transformed = {
						...data,
						pubDate: data.date,
						date: undefined,
					};
				}
				// If no categories or empty categories array, assign "ক্যাটাগরিহীন"
				if (!transformed.categories || transformed.categories.length === 0) {
					transformed = {
						...transformed,
						categories: ['ক্যাটাগরিহীন'],
					};
				}
				return transformed;
			})
		),
});

export const collections = { blog };

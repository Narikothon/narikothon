# Narikothon Blog

A modern, SEO-friendly blog built with Astro, featuring Bengali content support, taxonomy management, and automatic slug generation.

## 🚀 Features

- ✅ Minimal, clean styling with Tailwind CSS and DaisyUI
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support
- ✅ Bengali language support with English URL slugs
- ✅ Automatic taxonomy validation
- ✅ Search functionality with Pagefind
- ✅ Responsive design with grid/list view toggle
- ✅ Typography customization
- ✅ Author and category pages with pagination

## 📁 Project Structure

```
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── components/      # Astro components
│   ├── content/
│   │   └── blog/        # Blog post markdown files and images
│   ├── layouts/         # Page layouts
│   ├── lib/
│   │   ├── taxonomy.ts  # Author and category slug mappings
│   │   └── slug.ts      # Slug utility functions
│   ├── pages/           # Route pages
│   └── styles/          # Global styles
├── scripts/
│   ├── generate-taxonomy.ts  # Auto-generate taxonomy from posts
│   └── validate-taxonomy.ts # Validate taxonomy and create GitHub issues
├── astro.config.mjs
├── package.json
└── README.md
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm generate-taxonomy`  | Auto-generate taxonomy entries from all posts   |
| `pnpm validate-taxonomy`  | Validate taxonomy and create GitHub issues       |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |

## 📝 Adding a New Blog Post

### Step 1: Create the Post File

1. Navigate to `src/content/blog/`
2. Create a new markdown file (e.g., `110.md`)
3. Add a corresponding image file with the same name (e.g., `110.jpg`)

### Step 2: Write Frontmatter

Each post must include the following frontmatter at the top:

```yaml
---
title: "Your Post Title in Bengali or English"
date: 2025-01-15
author: "Author Name in Bengali"
categories: 
  - "Category Name in Bengali"
coverImage: "110.jpg"
---
```

**Frontmatter Fields:**

- `title` (required): The post title
- `date` (required): Publication date in `YYYY-MM-DD` format
- `author` (required): Author name in Bengali (must exist in `taxonomy.ts`)
- `categories` (optional): Array of category names in Bengali (must exist in `taxonomy.ts`)
- `coverImage` (optional): Image filename (should match a file in `src/content/blog/`)

### Step 3: Write Content

After the frontmatter, write your post content in Markdown:

```markdown
---
title: "My Post Title"
date: 2025-01-15
author: "রানিয়া কবির"
categories: 
  - "শিক্ষা ও ক্যারিয়ার"
coverImage: "110.jpg"
---

Your post content goes here. You can use **Markdown** syntax.

## Headings

- Lists
- More items

[Links](https://example.com) work too!
```

## 🔑 Taxonomy System

### Understanding Taxonomy

The project uses a taxonomy system to map Bengali author and category names to English URL slugs. This ensures:
- Clean, SEO-friendly URLs (e.g., `/author/rania-kabir/` instead of `/author/রানিয়া%20কবির/`)
- Consistent slug management
- Easy URL maintenance

### Taxonomy File: `src/lib/taxonomy.ts`

The taxonomy file contains mappings for all authors and categories:

```typescript
export const authors: Record<string, string> = {
	"রানিয়া কবির": "rania-kabir",
	"বিনতে আব্দুল্লাহ": "binte-abdullah",
	// ... more authors
};

export const categories: Record<string, string> = {
	"শিক্ষা ও ক্যারিয়ার": "education-career",
	"শরীয়াহ": "shariah",
	// ... more categories
};
```

### ⚠️ Important: Adding New Authors or Categories

**Before adding a post with a new author or category:**

1. **Check if it exists**: Open `src/lib/taxonomy.ts` and check if your author/category is already listed
2. **If missing**: Add it to the taxonomy file with an appropriate English slug:

```typescript
export const authors: Record<string, string> = {
	// ... existing authors
	"নতুন লেখক": "new-author",  // Add your new author here
};

export const categories: Record<string, string> = {
	// ... existing categories
	"নতুন বিভাগ": "new-category",  // Add your new category here
};
```

3. **Auto-generate taxonomy**: Alternatively, run `pnpm run generate-taxonomy` to automatically scan all posts and add missing entries (you'll need to update the generated slugs manually)

### Validation

The project automatically validates taxonomy during CI/CD:
- Missing authors/categories will trigger a GitHub issue
- Run `pnpm run validate-taxonomy` locally to check before committing

## 📂 Content Folder Structure

```
src/content/blog/
├── 1.md          # Post markdown file
├── 1.jpg          # Cover image for post 1
├── 2.md
├── 2.jpg
├── ...
└── 109.md
```

**Naming Convention:**
- Use sequential numbers or descriptive names for files
- Image filename should match the markdown filename (or use `coverImage` in frontmatter)
- Keep filenames simple (no spaces, use hyphens if needed)

## 🎨 Customization

### Typography Settings

Users can customize font size and line height through the settings modal. These settings:
- Apply only to blog post content (not the whole site)
- Are saved in browser localStorage
- Default to 18px font size and 1.5 line height

### View Controls

- **Grid/List Toggle**: Switch between grid and list view for post listings
- **Search**: Full-text search powered by Pagefind
- **Fullscreen**: Toggle fullscreen mode
- **Settings**: Open typography customization modal

## 🔍 Search

The blog uses Pagefind for search functionality:
- Automatically indexes all posts during build
- Supports full-text search
- Search modal accessible from the header

## 📱 Responsive Design

- Mobile-first approach
- Grid view: 3 columns on desktop, 1 column on mobile
- List view: Optimized for mobile reading
- Search modal positioned for mobile usability

## 🚀 Deployment

The project is configured to deploy to GitHub Pages automatically via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions builds the site
3. Validates taxonomy (creates issues for missing entries)
4. Deploys to GitHub Pages

## 🛠️ Development

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Taxonomy Management

```bash
# Generate taxonomy from all posts
pnpm run generate-taxonomy

# Validate taxonomy (check for missing entries)
pnpm run validate-taxonomy
```

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Markdown Guide](https://www.markdownguide.org/)

## 💡 Tips

1. **Always check taxonomy** before adding a post with a new author/category
2. **Use descriptive slugs** in taxonomy.ts (e.g., `education-career` not `cat1`)
3. **Keep image sizes reasonable** for better performance
4. **Test locally** before pushing to main branch
5. **Run validate-taxonomy** before committing if you've added new posts

## 🐛 Troubleshooting

**Post not showing up?**
- Check if author/category exists in `taxonomy.ts`
- Verify frontmatter syntax is correct
- Check file is in `src/content/blog/`

**Build failing?**
- Run `pnpm run validate-taxonomy` to check for missing taxonomy entries
- Check all required frontmatter fields are present

**Search not working?**
- Ensure `pnpm build` completed successfully (Pagefind runs in postbuild)
- Check browser console for errors

---

**Credit**: This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment (GitHub + Netlify)

This project is optimized for deployment via GitHub to avoid uploading thousands of dependency files.

### 1. Push to GitHub
I have already initialized Git and committed your files. To push to your account:
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands:
   ```bash
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

### 2. Connect to Netlify
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** -> **"Import from existing project"**.
3. Select **GitHub** and authorize.
4. Pick this repository.
5. Netlify will automatically detect Next.js settings. Click **"Deploy"**.

### Benefits
- **No Manual Uploads:** You only manage 29 files; the cloud handles the rest.
- **Auto-Updates:** Every time you change your code, the site updates itself.
- **Full Support:** All news-fetching features are preserved.

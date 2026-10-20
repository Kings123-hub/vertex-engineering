# Vertex Engineering Services Limited — Website

Plain HTML, CSS and JavaScript. No build step, free to host.

## Pages
index, about, services, industries, training, projects, hse-quality, careers, insights, contact, request-a-quote, privacy-policy, terms-of-use, 404.

## Publish on GitHub Pages
1. Create a new repository on github.com (Public, e.g. `vertex-website`).
2. Click **Add file > Upload files**, drag in everything INSIDE this folder (including the `assets` folder and the hidden `.nojekyll` file), then **Commit changes**.
3. Go to **Settings > Pages > Build and deployment > Source: Deploy from a branch > Branch: main, folder: / (root) > Save**.
4. After 1-2 minutes the site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Before you go live
- **Contact details:** open `contact.html` and replace the four `[bracketed]` lines with the real email, phone, address and hours.
- **Forms:** create a free form at formspree.io, then replace `YOUR_FORM_ID` in `contact.html` and `request-a-quote.html`.
- **Sitemap:** in `sitemap.xml` and `robots.txt`, replace `https://YOUR-USERNAME.github.io/REPO-NAME/` with your real site address.
- **Logo:** `assets/vesl-logo.png` (header, for light backgrounds) and `assets/vesl-logo-white.png` (footer, for dark backgrounds) are transparent PNGs. To use an official logo file later, replace these two files using the same names.
- **Legal pages:** `privacy-policy.html` and `terms-of-use.html` are plain-language templates. Have them reviewed before launch.
- **Claims:** only publish certifications, client names and project results you can verify.

## Slider images
`assets/hero-1.jpg` to `hero-5.jpg`. To change one, replace the file using the same name.


## Images
- `assets/img/photo-*.jpg`: photo crops taken from your five hero artworks.
- `assets/img/ill-*.svg`: illustrations drawn in the brand colours (crane, turbine, piping, gauge, power lines, factory, city, safety, careers, insights, contact).
- Every page has a banner photo, and every service, industry, value and step has an image or icon.
- To swap any image for a better one (for example a licensed photo from Unsplash or Pexels, or your own), save it with the **same file name** in `assets/img/` (900 x 600 px, JPG).
- These visuals are illustrative. Do not present them as completed company projects.

## Adding your portfolio (Projects page)
1. Open `projects.html`. The "Selected work" section has 6 dashed slots.
2. Put each photo in `assets/projects/` named `project-01.jpg` to `project-06.jpg` (landscape, about 1200 x 800 px, under 400 KB).
3. Edit the title, location, year and scope text under each slot, and the `alt` text in the image tag.
4. As soon as a photo with the right name exists, it replaces the dashed box automatically.
5. For more than 6 projects, copy a whole `<figure class="proj">...</figure>` block and change the number.

## Colors
At the top of `styles.css`: purple #6839C1, highlight #7B4FC6, lilac #BEA2E3, plum-black #1D151F.

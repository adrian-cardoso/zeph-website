# Zeph Website

Marketing website for **Zeph** — a clinical-grade smart respiratory health device and companion app designed to help patients manage conditions like COPD and asthma through guided breathing exercises.

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- No build tools or frameworks required
- Deployed on [Vercel](https://vercel.com)

## Features

- Responsive, mobile-first design with dark/light theme toggle
- Animated stat counters and scroll-reveal animations
- Blog section with 6 articles on respiratory health
- FAQ accordion, contact forms, and email capture modal
- SEO-optimized with Schema.org structured data, sitemap, and Open Graph tags
- Accessibility-focused with ARIA labels, keyboard navigation, and semantic HTML

## Pages

- **Home** — Hero, features, and CTA
- **Product** — Device showcase and specifications
- **Science** — Clinical research and data
- **Patients / Clinicians** — Audience-specific content
- **Blog** — Health and wellness articles
- **About, Careers, Help** — Company info
- **Privacy, Terms, HIPAA** — Legal and compliance

## Running Locally

No installation needed — just serve the directory:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Or open directly
open index.html
```

## Project Structure

```
├── index.html          # Homepage
├── product.html        # Product page
├── science.html        # Science page
├── patients.html       # Patient-focused content
├── clinicians.html     # Clinician-focused content
├── about.html          # About page
├── blog.html           # Blog listing
├── blog/               # Blog post pages
├── css/styles.css      # Unified stylesheet
├── js/                 # JavaScript files
├── fonts/              # Custom font files
├── images/             # Brand images and assets
├── sitemap.xml         # XML sitemap
└── robots.txt          # SEO configuration
```

## Deployment

Push to the `main` branch to trigger automatic deployment on Vercel.

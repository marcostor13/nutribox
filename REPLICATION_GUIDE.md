# Comprehensive Project Replication & Agentic Setup Guide

This guide provides the exact steps, code, and context to recreate the "Antigravity + Astro" agentic environment.

## 1. Project Initialization

Initialize a new Astro project with the minimal template and Tailwind CSS.

```bash
# Initialize Astro
npx create-astro@latest . --template minimal --install --no-git --yes

# Add Tailwind CSS
npx astro add tailwind --yes

# Install Astro-Icon
npm install astro-icon
```

## 2. Core Configuration

### `astro.config.mjs`
Update your configuration to include the necessary integrations:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [tailwind(), icon()]
});
```

### `.cursorrules` (Agent Context)
Create a `.cursorrules` file in the root directory. This forces the AI (Cursor/Antigravity) to follow conversion and performance standards.

```markdown
# Cursor Rules for Astro & Antigravity

# Generic Rules
- Always use `astro-icon` for icons. Do not use inline SVGs or other libraries.
- Use native Astro `<Image />` component for all images.
- Enforce semantic HTML (main, section, article, nav).
- Separate Astro Frontmatter (---) from the HTML template clearly.

# Antigravity Interaction
- When proposing UI changes, provide the full Astro component code.
- Always include an 'Audit' step for conversion optimization.
- For Hero sections, always propose at least two variations (A/B) based on Alex Hormozi's "Grand Slam Offer".

# Performance
- Critical CSS should be inlined in the head.
- Load non-critical fonts with `swap` display.
```

## 3. Agentic Skills (TypeScript)

Create the directory `src/skills/` and add the following files to enable agentic manipulation and auditing.

### `src/skills/astro-manipulator.ts`
Handles the separation of logic (frontmatter) and structure (HTML).

```typescript
export interface AstroComponent {
  frontmatter: string;
  template: string;
  fullCode: string;
}

export const parseAstroComponent = (code: string): AstroComponent => {
  const parts = code.split('---\n');
  if (parts.length >= 3) {
    return {
      frontmatter: parts[1],
      template: parts.slice(2).join('---\n').trim(),
      fullCode: code
    };
  }
  return { frontmatter: '', template: code, fullCode: code };
};
```

### `src/skills/audit-conversion.ts`
Automates the "Conversion Audit" requested.

```typescript
export const auditComponent = (html: string) => {
  const feedback: string[] = [];
  let score = 100;

  if (!html.includes('<button') && !html.includes('<a')) {
    feedback.push('Missing Call to Action (CTA)');
    score -= 30;
  }
  if (!/review|testimonial|client|trusted/i.test(html)) {
    feedback.push('No social proof detected');
    score -= 20;
  }
  if (!html.includes('<h1')) {
    feedback.push('Missing H1 headline');
    score -= 25;
  }

  return { score: Math.max(0, score), feedback, passed: score >= 70 };
};
```

### `src/skills/hero-generator.ts`
Generates A/B variations based on Hormozi's "Dream Outcome / Time Delay" logic.

```typescript
export interface HeroProps {
  dreamOutcome: string;
  perceivedLikelihood: string;
  timeDelay: string;
  effortSacrifice: string;
}

export const generateHeroAB = (props: HeroProps) => {
  const variationA = `<section><h1>Get ${props.dreamOutcome} in ${props.timeDelay}</h1>...</section>`;
  const variationB = `<section><h1>Stop ${props.effortSacrifice}. Start ${props.dreamOutcome}</h1>...</section>`;
  return { variationA, variationB };
};
```

## 4. Workflow Context

### Hormozi Principles
The "Hero" logic is based on the value equation:
`Value = (Dream Outcome * Perceived Likelihood) / (Time Delay * Effort & Sacrifice)`
Agentic variations should always aim to increase the numerator and decrease the denominator.

### Conversion Audit
Every proposed component must pass the `audit-conversion` check, ensuring that marketing fundamentals are not ignored during technical development.

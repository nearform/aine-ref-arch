const fs = require('fs');
const path = require('path');

// Load .env file if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !match[1].startsWith('#')) {
      process.env[match[1]] = (match[2] || '').replace(/^["']|["']$/g, '');
    }
  }
}

const Anthropic = require('@anthropic-ai/sdk').default;

const README_PATH = path.join(__dirname, 'README.md');
const SKILLS_DIR = path.join(__dirname, 'skills');
const COMMANDS_DIR = path.join(__dirname, '.claude', 'commands');
const OUTPUT_FILENAME = 'aine.md';

const FRONTMATTER = `---
name: aine
description: AINE Reference Architecture advisor - helps apply AI-Native SDLC patterns
---`;

const PREAMBLE = `You are an AI-Native SDLC advisor grounded in the AINE reference architecture.
When the user asks for guidance, reference the relevant building block and maturity stage.
Always ground your answers in the specific sections below — do not invent practices outside this framework.

$user_query`;

// Reuse heading regex pattern from build.js
const headingRegex = /^(#{1,3})\s+(.+)$/gm;

function parseReadme(content) {
  // Strip the markdown TOC (list of links at top)
  const stripped = content.replace(
    /^(# .+\n)\n*(?:- \[.*\]\(#.*\)\n(?:  .*\n)*)+\n*/m,
    '$1\n'
  );

  const sections = [];
  const lines = stripped.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        level: match[1].length,
        heading: match[2].trim(),
        body: ''
      };
    } else if (currentSection) {
      currentSection.body += line + '\n';
    }
  }
  if (currentSection) {
    sections.push(currentSection);
  }

  // Cap body at ~1500 chars to manage tokens
  for (const section of sections) {
    section.body = section.body.trim();
    if (section.body.length > 1500) {
      section.body = section.body.slice(0, 1500) + '...';
    }
  }

  return sections;
}

function buildPrompt(sections) {
  const sectionList = sections.map((s, i) => {
    const prefix = '#'.repeat(s.level);
    return `--- Section ${i + 1} ---
Heading: ${prefix} ${s.heading}
Content:
${s.body}`;
  }).join('\n\n');

  const headingList = sections.map(s => {
    const prefix = '#'.repeat(s.level);
    return `${prefix} ${s.heading}`;
  }).join('\n');

  const system = `You are generating a Claude Code custom skill file for the AINE reference architecture.

Your output must be ONLY the markdown body (no frontmatter, no preamble — those are added separately).

Rules:
1. Use EXACTLY these section headings in EXACTLY this order — do not rename, reorder, skip, or add headings:
${headingList}

2. Under each heading, write 2-3 concise instructional sentences that tell an AI advisor how to guide a user on that topic. Ground the guidance in the section content provided.

3. Do NOT include any content before the first heading.

4. Do NOT use fenced code blocks, mermaid diagrams, or tables. Plain markdown only (headings, paragraphs, bold, lists are fine).

5. Keep total output under 4000 words.`;

  const user = `Here are the README sections to base your guidance on:\n\n${sectionList}`;

  return { system, user };
}

function validateOutput(output, sections) {
  const missing = [];
  for (const s of sections) {
    // Check that each heading appears in output (fuzzy: just check the text portion)
    if (!output.includes(s.heading)) {
      missing.push(s.heading);
    }
  }
  if (missing.length > 0) {
    console.warn(`WARNING: ${missing.length} section heading(s) missing from output:`);
    for (const h of missing) {
      console.warn(`  - ${h}`);
    }
  }
  return missing.length === 0;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
    console.error('Usage: ANTHROPIC_API_KEY=sk-... npm run generate-skill');
    process.exit(1);
  }

  const readme = fs.readFileSync(README_PATH, 'utf-8');
  const sections = parseReadme(readme);
  console.log(`Parsed ${sections.length} sections from README.md`);

  const { system, user } = buildPrompt(sections);

  console.log('Calling Anthropic API...');
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    temperature: 0,
    system,
    messages: [{ role: 'user', content: user }]
  });

  const body = response.content[0].text;

  validateOutput(body, sections);

  const skillContent = `${FRONTMATTER}\n\n${PREAMBLE}\n\n${body}\n`;

  // Write to skills/ (git-tracked canonical output)
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
  const skillsPath = path.join(SKILLS_DIR, OUTPUT_FILENAME);
  fs.writeFileSync(skillsPath, skillContent);
  console.log(`Written: ${skillsPath}`);

  // Copy to .claude/commands/ (local convenience)
  fs.mkdirSync(COMMANDS_DIR, { recursive: true });
  const commandsPath = path.join(COMMANDS_DIR, OUTPUT_FILENAME);
  fs.writeFileSync(commandsPath, skillContent);
  console.log(`Written: ${commandsPath}`);

  console.log('Done. Use /project:aine in Claude Code to invoke the skill.');
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});

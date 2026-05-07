@AGENTS.md

# Dream Realizer — Project State

## What This App Does
Turn a dream (e.g. "I want to become a doctor") into a visual AI-powered roadmap.
- Decomposes the dream into a D3 horizontal tree diagram
- Each leaf node links to a recommended AI tool with a contextually matched prompt
- Users can mark steps complete and track overall progress

Live repo: https://github.com/Kevin-starring/dreamer.git

---

## Stack
- Next.js 16.2.4 (App Router) — **breaking changes from training data, read AGENTS.md**
- React 19, TypeScript 5
- D3.js 7 (d3-hierarchy, d3-selection, d3-shape)
- @anthropic-ai/sdk ^0.92.0
- @upstash/redis ^1.37.0 (replaced deprecated @vercel/kv)
- Vitest 4 for unit tests

---

## Architecture

### Key Files
| File | Role |
|---|---|
| `app/page.tsx` | State owner: dream, treeData, selectedTool, completedNodes, progress |
| `app/api/decompose/route.ts` | POST — golden-cache lookup or Anthropic API call |
| `app/api/track/route.ts` | POST — fire-and-forget Upstash Redis analytics |
| `components/DiagramPanel.tsx` | D3 horizontal tree (ssr:false, ref-only pattern) |
| `components/ToolPanel.tsx` | Right panel: tool info, prompt, complete toggle |
| `components/DreamInput.tsx` | Dream text input + submit button |
| `lib/types.ts` | Shared interfaces: TreeNode, Tool, PromptTemplate, DecomposeResponse |
| `lib/goldenPathMatch.ts` | Multi-term matcher → returns cache key string or null |
| `lib/parseDecomposition.ts` | Parses Anthropic API response into TreeNode tree |
| `data/tools.json` | 20 tools, 57 total prompts (multiple useCases per tool) |
| `public/cache/*.json` | 6 golden-path static JSONs (golden-path, doctor, lawyer, football-player, firefighter, scientist) |

### Data Flow
```
User types dream
  → goldenPathMatch() → string key or null
  → if key: serve static JSON from GOLDEN_CACHE (golden-cache source)
  → else: Anthropic API with AbortSignal.timeout(8000) → parseDecomposition()
  → setTreeData(root) → D3 diagram renders
  → user clicks leaf node → DiagramPanel fires onNodeClick(toolId, useCase, nodeName)
  → page.tsx finds tool, sets selectedTool + selectedUseCase + selectedNodeName
  → ToolPanel shows tool + prompt matched by useCase
  → user clicks "Mark this step as done" → toggleComplete(nodeName)
  → completedNodes Set updated + saved to localStorage
  → DiagramPanel re-renders with green nodes + progress bar updates
```

---

## TreeNode Schema
```typescript
interface TreeNode {
  name: string
  toolId: string | null      // null on root and branch nodes
  useCase?: string           // links to PromptTemplate.useCase in tools.json
  feasibility?: number       // shown as % badge on root + branches
  children?: TreeNode[]
}
```

---

## Golden Path Cache
6 cached dreams — served instantly without API call:

| Key | File | Feasibility |
|---|---|---|
| `youtube-cooking` | `golden-path.json` | 78% |
| `doctor` | `doctor.json` | 72% |
| `lawyer` | `lawyer.json` | 74% |
| `football-player` | `football-player.json` | 58% |
| `firefighter` | `firefighter.json` | 76% |
| `scientist` | `scientist.json` | 70% |

Matching keywords (goldenPathMatch.ts):
- doctor → `doctor, physician, medicine, medical school`
- lawyer → `lawyer, attorney, law school, legal career`
- football-player → `football player, footballer, soccer player, nfl, premier league`
- firefighter → `firefighter, fire fighter, fireman, fire department`
- scientist → `scientist, researcher, phd, laboratory, science career`

---

## tools.json — useCase Inventory (57 prompts across 20 tools)

### Career-specific useCases added (18 new):
| useCase | Tool | Used by |
|---|---|---|
| `personal-statement` | claude | doctor, lawyer |
| `career-roadmap` | claude | doctor, lawyer, scientist, football-player, firefighter |
| `study-plan` | claude | doctor, lawyer, firefighter |
| `interview-prep` | claude | firefighter |
| `training-program` | claude | football-player, firefighter |
| `mental-conditioning` | claude | football-player |
| `research-methodology` | claude | scientist |
| `nutrition-plan` | chatgpt | football-player, firefighter |
| `interview-practice` | chatgpt | lawyer |
| `program-research` | perplexity | doctor, lawyer, football-player, firefighter, scientist |
| `career-path-research` | perplexity | all career dreams |
| `study-tracker` | notion-ai | doctor, lawyer, scientist |
| `application-tracker` | notion-ai | doctor, lawyer, firefighter |
| `training-log` | notion-ai | football-player, firefighter |
| `professional-cv` | jasper | doctor, lawyer, firefighter |
| `research-paper` | jasper | doctor, lawyer, scientist |
| `highlight-reel` | capcut | football-player |
| `career-pitch` | gamma | scientist |

---

## Progress Tracking Feature
- **State**: `completedNodes: Set<string>` in page.tsx
- **Storage**: `localStorage` key = `dreamer_${dream.trim().toLowerCase()}`
- **Toggle**: ToolPanel "Mark this step as done" / "Completed — click to undo" button
- **Visual**: Completed nodes → green (#22c55e) + ✓ checkmark in D3 diagram
- **Progress bar**: `completedSteps / totalSteps` (leaf nodes with toolId only)
- **Persistence**: Same dream input restores previous progress on reload

---

## D3 Diagram — Key Patterns
```typescript
// horizontal tree: swap x/y axes
const treeLayout = tree<TreeNode>().size([innerH, innerW])
// translate uses (d.y, d.x) not (d.x, d.y)
.attr('transform', d => `translate(${d.y},${d.x})`)

// DiagramPanel is ssr:false + React.memo to prevent re-render on node click
const DiagramPanel = dynamic(() => import('@/components/DiagramPanel'), { ssr: false })
const MemoDiagramPanel = memo(DiagramPanel)

// D3 owns SVG internals — useEffect dep array: [data, onNodeClick, completedNodes, loading]
// cleanup: svg.selectAll('*').remove() at top of effect
```

---

## API Error Handling
```typescript
// Anthropic timeout: AbortSignal.timeout(8000)
// Catch by name string, NOT instanceof:
if (e.name === 'TimeoutError' || e.name === 'AbortError') { /* fallback */ }
// 401 → 503 response
// All other errors → serve golden-cache fallback with note
```

---

## Tests
```bash
npm test   # vitest run — 20 tests across 2 files
```
- `lib/parseDecomposition.test.ts` — 6 tests
- `lib/goldenPathMatch.test.ts` — 14 tests (covers all 6 paths + variants + unmatched)

Prebuild also validates all 6 JSON files parse correctly.

---

## Environment Variables Needed
| Var | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Claude API |
| `UPSTASH_REDIS_REST_URL` | Analytics tracking |
| `UPSTASH_REDIS_REST_TOKEN` | Analytics tracking |

Redis analytics is fire-and-forget — app works without it.

---

## Recent Commits (latest first)
- `ebb4c85` fix: change progress tracking UI text from Korean to English
- `06956be` feat: add dream progress tracking with localStorage persistence
- `a1e45e0` fix: resolve TS type error in ToolPanel prompt selection
- `ac28b91` feat: wire dream-type specific prompts end-to-end
- `168fedc` feat: add 5 new golden-path career dreams (doctor/lawyer/football/firefighter/scientist)

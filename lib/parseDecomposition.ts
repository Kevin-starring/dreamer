import type { TreeNode } from './types'

export class EmptyResponseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmptyResponseError'
  }
}

export function parseDecomposition(markdown: string): TreeNode {
  if (!markdown || markdown.trim().length === 0) {
    throw new EmptyResponseError('Empty markdown input')
  }

  const lines = markdown.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  const root: TreeNode = { name: 'Your Dream', toolId: null, children: [] }
  let currentBranch: TreeNode | null = null
  const branches: TreeNode[] = []
  let foundRoot = false

  for (const line of lines) {
    if (line.startsWith('# ')) {
      const raw = line.slice(2).trim()
      root.name = stripLeadingEmoji(raw)
      foundRoot = true
      continue
    }

    if (line.startsWith('## ')) {
      if (currentBranch) branches.push(currentBranch)
      const raw = line.slice(3).trim()
      currentBranch = { name: stripLeadingEmoji(raw), toolId: null, children: [] }
      continue
    }

    if (line.startsWith('- ') && currentBranch) {
      const raw = line.slice(2).trim()
      const toolIdMatch = raw.match(/\[tool:\s*([^\]]+)\]/i)
      const toolId = toolIdMatch ? toolIdMatch[1].trim() : null
      const name = raw.replace(/\[tool:[^\]]+\]/gi, '').trim()
      currentBranch.children = currentBranch.children ?? []
      currentBranch.children.push({ name, toolId })
    }
  }

  if (currentBranch) branches.push(currentBranch)

  if (branches.length === 0) {
    throw new EmptyResponseError(
      foundRoot ? 'No branches found in response' : 'No structure found in response'
    )
  }

  root.children = branches
  return root
}

function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}]+\s*/u, '').trim()
}

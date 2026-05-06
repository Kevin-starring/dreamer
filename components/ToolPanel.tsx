'use client'

import { useState } from 'react'
import type { Tool } from '@/lib/types'

interface Props {
  tool: Tool | null
  useCase?: string
}

export default function ToolPanel({ tool, useCase }: Props) {
  const [copied, setCopied] = useState(false)

  if (!tool) {
    return (
      <div className="tool-panel tool-panel--empty">
        <div className="tool-panel-hint">
          <p>Click any node in the diagram to see the recommended AI tool and prompt</p>
        </div>
      </div>
    )
  }

  const prompt = tool.prompts.find(p => p.useCase === useCase) ?? tool.prompts[0]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — user can select and copy manually
    }
  }

  const track = () => {
    const hash = btoa(tool.id).slice(0, 16)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId: tool.id, dreamHash: hash }),
    }).catch(() => {})
  }

  return (
    <div className="tool-panel">
      <div className="tool-header">
        <div className="tool-logo">{tool.emoji}</div>
        <div>
          <div className="tool-name">{tool.name}</div>
          <div className="tool-category">{tool.category}</div>
        </div>
      </div>

      <p className="tool-desc">{tool.description}</p>

      <div className="prompt-section">
        <div className="prompt-label">Recommended Prompt</div>
        <div className="prompt-box">
          <pre>{prompt.prompt}</pre>
          <button
            className="copy-btn"
            onClick={handleCopy}
            aria-label="Copy prompt to clipboard"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
        </div>
        {prompt.prompt.includes('[') && (
          <p className="placeholder-note">Replace text in [BRACKETS] with your details</p>
        )}
      </div>

      <a
        className="open-btn"
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
      >
        Open in {tool.name} →
      </a>

      <div className="guide-section">
        <h4>How to use {tool.name}</h4>
        {prompt.steps.map((step, i) => (
          <div key={i} className="guide-step">
            <span>Step {i + 1}:</span> {step}
          </div>
        ))}
      </div>

      <div className="guide-section">
        <h4>Why this tool?</h4>
        <p className="why-text">{tool.why}</p>
      </div>
    </div>
  )
}

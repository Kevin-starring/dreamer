'use client'

import { useState, useEffect } from 'react'
import type { Tool } from '@/lib/types'
import { fillPrompt } from '@/lib/fillPrompt'
import { matchBestPrompt } from '@/lib/matchBestPrompt'

interface Props {
  tool: Tool | null
  useCase?: string
  nodeName?: string | null
  dream?: string
  isCompleted?: boolean
  onToggleComplete?: (nodeName: string) => void
}

type Rating = 'like' | 'dislike'

const RATINGS_KEY = 'dreamer_ratings'

function loadRating(toolId: string): Rating | null {
  try {
    const stored = localStorage.getItem(RATINGS_KEY)
    const all: Record<string, Rating> = stored ? JSON.parse(stored) : {}
    return all[toolId] ?? null
  } catch {
    return null
  }
}

function saveRating(toolId: string, value: Rating | null) {
  try {
    const stored = localStorage.getItem(RATINGS_KEY)
    const all: Record<string, Rating> = stored ? JSON.parse(stored) : {}
    if (value === null) delete all[toolId]
    else all[toolId] = value
    localStorage.setItem(RATINGS_KEY, JSON.stringify(all))
  } catch { /* localStorage unavailable */ }
}

export default function ToolPanel({ tool, useCase, nodeName, dream, isCompleted, onToggleComplete }: Props) {
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useState<Rating | null>(null)

  // Load stored rating whenever the displayed tool changes
  useEffect(() => {
    if (!tool) { setRating(null); return }
    setRating(loadRating(tool.id))
  }, [tool?.id])

  if (!tool) {
    return (
      <div className="tool-panel tool-panel--empty">
        <div className="tool-panel-hint">
          <p>Click any node in the diagram to see the recommended AI tool and prompt</p>
        </div>
      </div>
    )
  }

  const prompt = tool.prompts.find(p => p.useCase === useCase) ?? matchBestPrompt(tool, nodeName)
  const promptText = fillPrompt(prompt.prompt, dream ?? '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
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

  const handleToggle = () => {
    if (nodeName && onToggleComplete) onToggleComplete(nodeName)
  }

  const handleRate = (value: Rating) => {
    const next = rating === value ? null : value   // clicking same button removes rating
    setRating(next)
    saveRating(tool.id, next)
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

      {/* Step completion toggle */}
      {nodeName && onToggleComplete && (
        <button
          className={`complete-btn ${isCompleted ? 'complete-btn--done' : ''}`}
          onClick={handleToggle}
        >
          {isCompleted ? '✅ Completed — click to undo' : '☐ Mark this step as done'}
        </button>
      )}

      <p className="tool-desc">{tool.description}</p>

      <div className="prompt-section">
        <div className="prompt-label">Recommended Prompt</div>
        <div className="prompt-box">
          <pre>{promptText}</pre>
          <button
            className="copy-btn"
            onClick={handleCopy}
            aria-label="Copy prompt to clipboard"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
        </div>
        {promptText.includes('[') && (
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

      {/* Rating section */}
      <div className="rating-section">
        <div className="rating-label">Was this recommendation helpful?</div>
        <div className="rating-buttons">
          <button
            className={`rating-btn rating-btn--like${rating === 'like' ? ' rating-btn--active' : ''}`}
            onClick={() => handleRate('like')}
            aria-label="Mark recommendation as helpful"
          >
            <span className="rating-icon">👍</span>
            {rating === 'like' ? 'Helpful!' : 'Helpful'}
          </button>
          <button
            className={`rating-btn rating-btn--dislike${rating === 'dislike' ? ' rating-btn--active' : ''}`}
            onClick={() => handleRate('dislike')}
            aria-label="Mark recommendation as not helpful"
          >
            <span className="rating-icon">👎</span>
            {rating === 'dislike' ? 'Not helpful' : 'Not helpful'}
          </button>
        </div>
        {rating && (
          <p className="rating-feedback">
            {rating === 'like'
              ? 'Thanks for the feedback! Glad it helped. 🎉'
              : 'Thanks for letting us know. Click again to undo.'}
          </p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import DreamInput from '@/components/DreamInput'
import ToolPanel from '@/components/ToolPanel'
import type { DecomposeResponse, Tool, TreeNode } from '@/lib/types'
import toolsData from '@/data/tools.json'

const DiagramPanel = dynamic(() => import('@/components/DiagramPanel'), { ssr: false })
const MemoDiagramPanel = memo(DiagramPanel)

const tools: Tool[] = toolsData as Tool[]

export default function Home() {
  const [dream, setDream] = useState('')
  const [treeData, setTreeData] = useState<TreeNode | null>(null)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [selectedUseCase, setSelectedUseCase] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheNote, setCacheNote] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!dream.trim() || loading) return
    setLoading(true)
    setError(null)
    setCacheNote(null)
    setSelectedTool(null)
    setSelectedUseCase(undefined)

    try {
      const res = await fetch('/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: dream.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      const data: DecomposeResponse = await res.json()
      setTreeData(data.root)
      if (data.note) setCacheNote(data.note)

    } catch {
      setError('Connection error. Check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = useCallback((toolId: string, useCase?: string) => {
    const found = tools.find(t => t.id === toolId)
    setSelectedTool(found ?? null)
    setSelectedUseCase(useCase)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Dream <span>Realizer</span></h1>
        <p>Turn your dream into action with AI</p>
      </header>

      <DreamInput
        value={dream}
        onChange={setDream}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {cacheNote && (
        <div className="cache-note">{cacheNote} — try the YouTube cooking channel demo</div>
      )}

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <main className="main">
        <MemoDiagramPanel
          data={treeData}
          onNodeClick={handleNodeClick}
          loading={loading}
        />
        <ToolPanel tool={selectedTool} useCase={selectedUseCase} />
      </main>
    </div>
  )
}

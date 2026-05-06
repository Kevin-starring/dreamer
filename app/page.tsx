'use client'

import { useState, useCallback, useEffect, useRef, memo } from 'react'
import dynamic from 'next/dynamic'
import DreamInput from '@/components/DreamInput'
import ToolPanel from '@/components/ToolPanel'
import type { DecomposeResponse, Tool, TreeNode } from '@/lib/types'
import toolsData from '@/data/tools.json'

const DiagramPanel = dynamic(() => import('@/components/DiagramPanel'), { ssr: false })
const MemoDiagramPanel = memo(DiagramPanel)

const tools: Tool[] = toolsData as Tool[]

/** Returns the names of all leaf nodes that have a toolId */
function getLeafNames(node: TreeNode): string[] {
  if (!node.children || node.children.length === 0) {
    return node.toolId ? [node.name] : []
  }
  return node.children.flatMap(getLeafNames)
}

export default function Home() {
  const [dream, setDream] = useState('')
  const [treeData, setTreeData] = useState<TreeNode | null>(null)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [selectedUseCase, setSelectedUseCase] = useState<string | undefined>(undefined)
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null)
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheNote, setCacheNote] = useState<string | null>(null)

  // Stable ref so toggleComplete closure doesn't stale-capture dream
  const dreamRef = useRef(dream)
  useEffect(() => { dreamRef.current = dream }, [dream])

  const handleSubmit = async () => {
    if (!dream.trim() || loading) return
    setLoading(true)
    setError(null)
    setCacheNote(null)
    setSelectedTool(null)
    setSelectedUseCase(undefined)
    setSelectedNodeName(null)

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

      // Load saved progress for this dream from localStorage
      const key = `dreamer_${dream.trim().toLowerCase()}`
      try {
        const saved = localStorage.getItem(key)
        setCompletedNodes(saved ? new Set(JSON.parse(saved)) : new Set())
      } catch {
        setCompletedNodes(new Set())
      }

    } catch {
      setError('Connection error. Check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = useCallback((toolId: string, useCase?: string, nodeName?: string) => {
    const found = tools.find(t => t.id === toolId)
    setSelectedTool(found ?? null)
    setSelectedUseCase(useCase)
    setSelectedNodeName(nodeName ?? null)
  }, [])

  const toggleComplete = useCallback((nodeName: string) => {
    setCompletedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeName)) next.delete(nodeName)
      else next.add(nodeName)
      try {
        const key = `dreamer_${dreamRef.current.trim().toLowerCase()}`
        localStorage.setItem(key, JSON.stringify([...next]))
      } catch { /* localStorage unavailable */ }
      return next
    })
  }, [])

  // Progress calculation
  const leafNames = treeData ? getLeafNames(treeData) : []
  const totalSteps = leafNames.length
  const completedSteps = leafNames.filter(n => completedNodes.has(n)).length
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

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

      {treeData && totalSteps > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">진척률</span>
            <span className="progress-steps">{completedSteps} / {totalSteps} 단계 완료</span>
            <span className="progress-pct">{progressPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      <main className="main">
        <MemoDiagramPanel
          data={treeData}
          onNodeClick={handleNodeClick}
          completedNodes={completedNodes}
          loading={loading}
        />
        <ToolPanel
          tool={selectedTool}
          useCase={selectedUseCase}
          nodeName={selectedNodeName}
          isCompleted={selectedNodeName ? completedNodes.has(selectedNodeName) : false}
          onToggleComplete={toggleComplete}
        />
      </main>
    </div>
  )
}

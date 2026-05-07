'use client'

import { useState } from 'react'
import type { TreeNode } from '@/lib/types'

interface EditTask { id: string; name: string }
interface EditBranch { id: string; name: string; tasks: EditTask[] }

interface Props {
  treeData: TreeNode
  dream: string
  onTreeUpdate: (newTree: TreeNode) => void
}

let _uid = 0
const uid = () => String(++_uid)

function initBranches(tree: TreeNode): EditBranch[] {
  return (tree.children ?? []).map(branch => ({
    id: uid(),
    name: branch.name,
    tasks: (branch.children ?? []).map(leaf => ({ id: uid(), name: leaf.name })),
  }))
}

export default function PlanEditorPanel({ treeData, dream, onTreeUpdate }: Props) {
  const [branches, setBranches] = useState<EditBranch[]>(() => initBranches(treeData))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setBranchName = (bId: string, name: string) =>
    setBranches(prev => prev.map(b => b.id === bId ? { ...b, name } : b))

  const setTaskName = (bId: string, tId: string, name: string) =>
    setBranches(prev => prev.map(b =>
      b.id === bId ? { ...b, tasks: b.tasks.map(t => t.id === tId ? { ...t, name } : t) } : b
    ))

  const deleteTask = (bId: string, tId: string) =>
    setBranches(prev => prev.map(b =>
      b.id === bId ? { ...b, tasks: b.tasks.filter(t => t.id !== tId) } : b
    ))

  const addTask = (bId: string) =>
    setBranches(prev => prev.map(b =>
      b.id === bId ? { ...b, tasks: [...b.tasks, { id: uid(), name: '' }] } : b
    ))

  const deleteBranch = (bId: string) =>
    setBranches(prev => prev.filter(b => b.id !== bId))

  const addBranch = () =>
    setBranches(prev => [...prev, { id: uid(), name: '', tasks: [{ id: uid(), name: '' }] }])

  const handleApply = async () => {
    const valid = branches
      .filter(b => b.name.trim())
      .map(b => ({ name: b.name.trim(), tasks: b.tasks.map(t => t.name.trim()).filter(Boolean) }))
      .filter(b => b.tasks.length > 0)

    if (valid.length === 0) return

    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream, branches: valid }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? '재생성에 실패했습니다. 다시 시도해주세요.')
        return
      }
      const data = await res.json()
      onTreeUpdate(data.root)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('연결 오류. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="plan-editor">
      <div className="plan-editor-branches">
        {branches.map(branch => (
          <div key={branch.id} className="editor-branch">
            <div className="editor-branch-header">
              <input
                className="editor-branch-name"
                value={branch.name}
                onChange={e => setBranchName(branch.id, e.target.value)}
                placeholder="단계 이름 (예: 기초 준비)"
              />
              <button
                className="editor-icon-btn"
                onClick={() => deleteBranch(branch.id)}
                title="단계 삭제"
              >✕</button>
            </div>
            <div className="editor-tasks">
              {branch.tasks.map(task => (
                <div key={task.id} className="editor-task-row">
                  <span className="editor-task-bullet">•</span>
                  <input
                    className="editor-task-input"
                    value={task.name}
                    onChange={e => setTaskName(branch.id, task.id, e.target.value)}
                    placeholder="실행 방안 입력"
                  />
                  <button
                    className="editor-icon-btn editor-icon-btn--sm"
                    onClick={() => deleteTask(branch.id, task.id)}
                    title="삭제"
                  >✕</button>
                </div>
              ))}
              <button className="editor-add-btn" onClick={() => addTask(branch.id)}>
                + 실행 방안 추가
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="editor-add-branch-btn" onClick={addBranch}>
        + 단계 추가
      </button>

      {error && <p className="editor-error">{error}</p>}

      <button className="editor-apply-btn" onClick={handleApply} disabled={loading}>
        {loading
          ? '✨ AI 도구 재추천 중...'
          : success
            ? '✅ 완료! 다이어그램이 업데이트되었습니다'
            : '✨ 추천 프롬프트 & AI 모듈 재생성'}
      </button>
    </div>
  )
}

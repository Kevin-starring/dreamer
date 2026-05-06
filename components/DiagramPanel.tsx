'use client'

import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { tree, hierarchy } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import type { TreeNode } from '@/lib/types'

interface Props {
  data: TreeNode | null
  onNodeClick: (toolId: string, useCase?: string) => void
  loading: boolean
}

const WIDTH = 900
const HEIGHT = 520
const MARGIN = { top: 40, right: 180, bottom: 40, left: 160 }

export default function DiagramPanel({ data, onNodeClick, loading }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    if (!data || loading) return

    const innerW = WIDTH - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const root = hierarchy<TreeNode>(data)

    // horizontal tree: swap x/y — tree().size([height, width])
    const treeLayout = tree<TreeNode>().size([innerH, innerW])
    treeLayout(root)

    // links
    const linkGen = linkHorizontal<unknown, { x: number; y: number }>()
      .x(d => (d as { x: number; y: number }).y)
      .y(d => (d as { x: number; y: number }).x)

    g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d => linkGen(d as Parameters<typeof linkGen>[0]) ?? '')
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)

    // nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${(d as { x: number; y: number }).y},${(d as { x: number; y: number }).x})`)
      .style('cursor', d => d.data.toolId ? 'pointer' : 'default')
      .on('click', (_, d) => {
        if (d.data.toolId) onNodeClick(d.data.toolId, d.data.useCase)
      })

    // node circles
    node
      .append('circle')
      .attr('r', d => d.depth === 0 ? 14 : d.data.toolId ? 8 : 6)
      .attr('fill', d => {
        if (d.depth === 0) return '#7c5cfc'
        if (d.data.toolId) return '#7c5cfc'
        return '#252535'
      })
      .attr('stroke', d => d.data.toolId ? '#7c5cfc' : '#3a3a4a')
      .attr('stroke-width', 2)

    // feasibility badge on root and branches
    node
      .filter(d => d.data.feasibility !== undefined)
      .append('text')
      .attr('dy', d => d.depth === 0 ? -20 : -14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#22c55e')
      .text(d => `${d.data.feasibility}%`)

    // node labels
    node
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', d => {
        if (d.depth === 0) return 0
        return d.children ? -12 : 12
      })
      .attr('text-anchor', d => {
        if (d.depth === 0) return 'middle'
        return d.children ? 'end' : 'start'
      })
      .attr('font-size', d => d.depth === 0 ? '13px' : d.data.toolId ? '11px' : '12px')
      .attr('font-weight', d => (d.depth === 0 || !d.data.toolId) ? '600' : '400')
      .attr('fill', d => d.data.toolId ? '#e0e0e0' : '#ccc')
      .text(d => d.data.name)

    // hover effect for clickable nodes
    node
      .filter(d => !!d.data.toolId)
      .on('mouseenter', function () {
        select(this).select('circle').attr('fill', '#9d7fff')
      })
      .on('mouseleave', function () {
        select(this).select('circle').attr('fill', '#7c5cfc')
      })

  }, [data, onNodeClick, loading])

  return (
    <div className="diagram-panel">
      {loading && (
        <div className="diagram-loading">
          <div className="spinner" />
          <p>Realizing your dream...</p>
        </div>
      )}
      {!loading && !data && (
        <div className="diagram-empty">
          <p>Type your dream above to see your AI roadmap</p>
        </div>
      )}
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ display: data && !loading ? 'block' : 'none', maxWidth: '100%' }}
      />
    </div>
  )
}

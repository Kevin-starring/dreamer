'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { select } from 'd3-selection'
import { tree, hierarchy } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import { zoom, zoomIdentity } from 'd3-zoom'
import type { ZoomBehavior } from 'd3-zoom'
import type { TreeNode } from '@/lib/types'
import type { Theme } from '@/lib/useTheme'

interface Props {
  data: TreeNode | null
  onNodeClick: (toolId: string, useCase?: string, nodeName?: string) => void
  completedNodes: Set<string>
  loading: boolean
  theme?: Theme
}

const MIN_WIDTH = 900
const HEIGHT = 520
const MARGIN = { top: 40, right: 200, bottom: 40, left: 160 }

export default function DiagramPanel({ data, onNodeClick, completedNodes, loading, theme = 'dark' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [panelWidth, setPanelWidth] = useState(MIN_WIDTH)

  // Track panel width so D3 uses the full available space
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setPanelWidth(Math.floor(entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = select<SVGSVGElement, unknown>(svgRef.current)
    svg.selectAll('*').remove()

    if (!data || loading) return

    // Read theme-aware colors from CSS variables
    const cs = getComputedStyle(document.documentElement)
    const C_ACCENT   = cs.getPropertyValue('--accent').trim()   || '#7c5cfc'
    const C_LINK     = cs.getPropertyValue('--d-link').trim()   || '#252540'
    const C_BRANCH   = cs.getPropertyValue('--d-branch').trim() || '#1e1e34'
    const C_TEXT     = cs.getPropertyValue('--d-text').trim()   || '#c8c4e0'
    const C_TEXT_T   = cs.getPropertyValue('--d-text-tool').trim() || '#eeeaf8'
    const C_DONE     = cs.getPropertyValue('--success').trim()  || '#22c55e'

    // Use actual panel width so labels never hit the right boundary
    const effectiveW = Math.max(panelWidth - 10, MIN_WIDTH)
    const innerW = effectiveW - MARGIN.left - MARGIN.right
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom

    const g = svg.append('g')

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
      .attr('stroke', d => {
        const target = d.target.data
        return (target.toolId && completedNodes.has(target.name))
          ? C_DONE
          : C_LINK
      })
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
        if (d.data.toolId) onNodeClick(d.data.toolId, d.data.useCase, d.data.name)
      })

    const isCompleted = (d: { data: TreeNode }) => !!d.data.toolId && completedNodes.has(d.data.name)

    node
      .append('circle')
      .attr('r', d => d.depth === 0 ? 14 : d.data.toolId ? 8 : 6)
      .attr('fill', d => {
        if (d.depth === 0) return C_ACCENT
        if (isCompleted(d)) return C_DONE
        if (d.data.toolId) return C_ACCENT
        return C_BRANCH
      })
      .attr('stroke', d => {
        if (isCompleted(d)) return C_DONE
        if (d.data.toolId) return C_ACCENT
        return C_BRANCH
      })
      .attr('stroke-width', 2)

    node
      .filter(d => isCompleted(d))
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#fff')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .text('✓')

    node
      .filter(d => d.data.feasibility !== undefined)
      .append('text')
      .attr('dy', d => d.depth === 0 ? -20 : -14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', C_DONE)
      .text(d => `${d.data.feasibility}%`)

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
      .attr('fill', d => {
        if (isCompleted(d)) return C_DONE
        return d.data.toolId ? C_TEXT_T : C_TEXT
      })
      .text(d => d.data.name)

    node
      .filter(d => !!d.data.toolId)
      .on('mouseenter', function (_, d) {
        if (!isCompleted(d)) {
          select(this).select('circle').attr('fill', C_ACCENT + 'cc')
        }
      })
      .on('mouseleave', function (_, d) {
        select(this).select('circle').attr('fill', isCompleted(d) ? C_DONE : C_ACCENT)
      })

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', event => {
        g.attr('transform', event.transform.toString())
      })

    svg.call(zoomBehavior).on('dblclick.zoom', null)
    svg.call(zoomBehavior.transform, zoomIdentity.translate(MARGIN.left, MARGIN.top))
    zoomRef.current = zoomBehavior

  }, [data, onNodeClick, completedNodes, loading, panelWidth, theme])

  const handleZoomIn = useCallback(() => {
    if (!zoomRef.current || !svgRef.current) return
    select<SVGSVGElement, unknown>(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1.4)
  }, [])

  const handleZoomOut = useCallback(() => {
    if (!zoomRef.current || !svgRef.current) return
    select<SVGSVGElement, unknown>(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1 / 1.4)
  }, [])

  const handleZoomReset = useCallback(() => {
    if (!zoomRef.current || !svgRef.current) return
    select<SVGSVGElement, unknown>(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.transform, zoomIdentity.translate(MARGIN.left, MARGIN.top))
  }, [])

  return (
    <div className="diagram-panel" ref={containerRef}>
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
      {data && !loading && (
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn} title="확대">＋</button>
          <button className="zoom-btn" onClick={handleZoomReset} title="원래 크기">⟳</button>
          <button className="zoom-btn" onClick={handleZoomOut} title="축소">－</button>
        </div>
      )}
      <svg
        ref={svgRef}
        width={panelWidth}
        height={HEIGHT}
        style={{ display: data && !loading ? 'block' : 'none', overflow: 'visible' }}
      />
    </div>
  )
}

'use client'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function DreamInput({ value, onChange, onSubmit, loading }: Props) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) onSubmit()
  }

  return (
    <div className="input-area">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="I want to launch a YouTube cooking channel..."
        maxLength={500}
        disabled={loading}
        aria-label="Describe your dream"
      />
      <button
        onClick={onSubmit}
        disabled={loading || value.trim().length === 0}
        aria-label="Realize my dream"
      >
        {loading ? 'Realizing...' : 'Realize My Dream ✨'}
      </button>
    </div>
  )
}

interface AvatarProps {
  name: string
  colorIndex: number
}

const AVATAR_COLORS = [
  '#6366f1', '#0891b2', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#2563eb', '#0d9488', '#ca8a04', '#e11d48',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({ name, colorIndex }: AvatarProps) {
  const bg = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]

  return (
    <span className="avatar" style={{ backgroundColor: bg }}>
      {getInitials(name)}
    </span>
  )
}

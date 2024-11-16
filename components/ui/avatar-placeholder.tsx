export function AvatarPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
      <span className="text-sm font-medium">{text[0].toUpperCase()}</span>
    </div>
  )
} 
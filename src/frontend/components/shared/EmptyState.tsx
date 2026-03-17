interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && (
        <button className="empty-state__action btn btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

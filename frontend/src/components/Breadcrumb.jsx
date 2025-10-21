import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-neutral-600 dark:text-neutral-400" role="navigation">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="hover:text-[#1e3a8a] underline-offset-2 hover:underline focus-visible">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-neutral-800 dark:text-neutral-200">{item.label}</span>
            )}
            {idx < items.length - 1 && <span aria-hidden className="opacity-60">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between xl:mb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl xl:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

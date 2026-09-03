export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wider text-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-brand text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
        )}
      </div>
    </section>
  );
}

import Breadcrumb from './Breadcrumb';

export function PageHeader({ title, subtitle, actions, breadcrumbs = true }) {
  return (
    <div className="mb-6 sm:mb-8 font-display">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark-charcoal tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-natural-wood max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {Array.isArray(actions) && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>

      {breadcrumbs && (
        <div className="mt-3 pt-3 border-t border-temple-gold/15">
          <Breadcrumb />
        </div>
      )}
    </div>
  );
}

export default PageHeader;

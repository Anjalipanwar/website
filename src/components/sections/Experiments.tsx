import { experiments, type ExperimentStatus } from '../../content';
import { Check, Cross, MarginNote, Squiggle, Underline } from '../annotations';

function StatusMark({ status, seed, className }: { status: ExperimentStatus; seed: number; className: string }) {
  if (status === 'shipped') return <Check seed={seed} className={className} />;
  if (status === 'killed') return <Cross seed={seed} className={className} />;
  return <Squiggle seed={seed} className={className} />;
}

const ORDER: ExperimentStatus[] = ['shipped', 'in-progress', 'killed'];

/** What the marks mean. */
function Key({ seed, className }: { seed: number; className: string }) {
  return (
    <div className={className}>
      <MarginNote seed={seed + 1} rotate={-3} className="text-[1.9rem]">
        {experiments.keyTitle}
      </MarginNote>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 lg:block lg:space-y-1">
        {ORDER.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <StatusMark status={s} seed={seed + 5 + i} className="h-7 w-8" />
            <MarginNote color="ink" seed={seed + 10 + i} rotate={-1} className="text-[1.8rem]">
              {experiments.statusLabels[s]}
            </MarginNote>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Experiments() {
  return (
    <section id="experiments" aria-labelledby="experiments-title" className="py-[var(--section)]">
      <div className="frame">
        {/* the key lives in the margin on desktop */}
        <div className="frame-margin">
          <Key seed={160} className="hidden lg:block lg:pt-3" />
        </div>

        <div className="frame-main">
          <h2 id="experiments-title" className="loud t-display">
            {experiments.title}
          </h2>
          <p className="t-lead mt-6 max-w-[38rem]">{experiments.intro}</p>
          <Key seed={300} className="mt-8 lg:hidden" />

          <ol className="mt-10 lg:mt-14">
            {experiments.entries.map((e, i) => (
              <li
                key={i}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-x-5 gap-y-3 border-t border-ink/15 py-7 last:border-b md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,16rem)] md:gap-x-8 lg:py-9"
              >
                <StatusMark status={e.status} seed={180 + i} className="mt-1 h-10 w-12 md:h-12 md:w-14" />
                <div>
                  <h3 className="text-[1.5rem] font-bold leading-tight tracking-tight lg:text-[1.9rem]">
                    {e.status === 'killed' ? (
                      <Underline strike color="pink" seed={190 + i} weight={3}>
                        {e.title}
                      </Underline>
                    ) : (
                      e.title
                    )}
                  </h3>
                  <p className="mt-2 max-w-[52ch]">{e.summary}</p>
                  <p className="mt-1 text-[1rem] opacity-75">
                    <span className="sr-only">{experiments.statusLabels[e.status]}, </span>
                    {e.when}
                  </p>
                </div>
                <MarginNote as="p" seed={200 + i} className="col-start-2 max-w-[16rem] md:col-start-3 md:mt-1">
                  {experiments.learnedPrefix} {e.learned}
                </MarginNote>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

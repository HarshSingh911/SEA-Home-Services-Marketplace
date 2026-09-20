import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="app-noise flex min-h-[100dvh] items-center justify-center bg-primary px-5">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[30px] bg-card p-8 text-center shadow-[0_24px_80px_rgba(24,31,104,.25)] sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Compass size={31} />
        </span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-accent">Wrong turn</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.05em]">This page drifted away.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          The link you followed doesn’t point to a SEA service anymore. Let’s get you back to useful.
        </p>
        <Link href="/" data-testid="link-not-found-home" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Back to SEA
        </Link>
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-40 w-40 rounded-full border-[22px] border-accent/15" />
      </div>
    </div>
  );
}
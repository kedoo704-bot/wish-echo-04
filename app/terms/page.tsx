import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms - Kehdoo",
  description: "Terms of use for Kehdoo, the greeting card creator.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <span>{"<-"}</span> <span className="font-serif text-base">Kehdoo</span>
      </Link>

      <article className="mt-10">
        <h1 className="font-serif text-5xl leading-tight">Terms of Use</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Kehdoo is a free tool for creating and sharing animated greeting cards. By using Kehdoo
          you agree to the following simple terms.
        </p>

        <Section title="Use responsibly">
          <p>
            You may use Kehdoo to send genuine greetings and messages of goodwill. You may not use
            Kehdoo to harass, threaten, or send unwanted communications to others.
          </p>
          <p>
            Do not use Kehdoo to distribute content that is illegal, discriminatory, or harmful.
            You are solely responsible for the content of any wish you create and share.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            Kehdoo is provided "as is" without any warranty of any kind. We make no guarantees
            about uptime, availability, or the permanent accessibility of any wish link.
          </p>
          <p>
            Share links depend on Kehdoo's hosted service. Always test your link before sharing if
            the message is time-sensitive.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            The words you write are yours. Kehdoo claims no ownership over your message content.
          </p>
          <p>
            The Kehdoo name, logo, and design are our property. Please don't impersonate Kehdoo or
            use our branding in misleading ways.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these terms from time to time. The current version will always be at{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              kehdoo.com/terms
            </Link>
            .
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions?{" "}
            <a
              href="mailto:hello@kehdoo.com"
              className="underline underline-offset-2 hover:text-foreground"
            >
              hello@kehdoo.com
            </a>
          </p>
        </Section>
      </article>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>(c) Kehdoo - kehdoo.com</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </footer>
    </main>
  );
}

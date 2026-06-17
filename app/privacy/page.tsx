import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Kehdoo",
  description: "Kehdoo collects no personal data. Your messages are never stored anywhere.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <span>←</span> <span className="font-serif text-base">Kehdoo</span>
      </Link>

      <article className="mt-10">
        <h1 className="font-serif text-5xl leading-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2025</p>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Kehdoo is built on a simple principle: your words are yours. We have no backend, no
          database, and no account system. There is nothing to leak.
        </p>

        <Section title="What we collect">
          <p>Nothing. Kehdoo does not collect, store, or transmit any personal information.</p>
          <p>
            When you create a wish, the content (names, message, style choices) is encoded directly
            into the URL. It never leaves your device in any other form. When you share the link,
            the recipient's browser decodes the wish locally — no server is involved.
          </p>
        </Section>

        <Section title="Cookies & tracking">
          <p>
            Kehdoo sets no cookies and uses no analytics, tracking pixels, or fingerprinting
            scripts. There is no user session, login, or any persistent identifier.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Kehdoo loads fonts from Google Fonts. Google may log the font request (including your IP
            address) in accordance with their own{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              privacy policy
            </a>
            .
          </p>
          <p>
            When you use the WhatsApp or Twitter share buttons, those services handle the share
            action according to their own privacy policies. Kehdoo does not send them any data
            beyond what is in the URL.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            Since we store nothing, there is nothing to retain or delete. If you lose the wish URL,
            the wish is gone — we cannot recover it.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Reach us at{" "}
            <a
              href="mailto:hello@kehdoo.com"
              className="underline underline-offset-2 hover:text-foreground"
            >
              hello@kehdoo.com
            </a>
            .
          </p>
        </Section>
      </article>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>© Kehdoo · kehdoo.com</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </footer>
    </main>
  );
}

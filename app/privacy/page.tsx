import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy - Kehdoo",
  description:
    "How Kehdoo handles greeting cards, optional sign-in, photos, cookies, and stored card links.",
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
        <span>{"<-"}</span> <span className="font-serif text-base">Kehdoo</span>
      </Link>

      <article className="mt-10">
        <h1 className="font-serif text-5xl leading-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Kehdoo is built on a simple principle: your words are yours. We collect only what is
          needed to create and share your greeting, and signing in is optional.
        </p>

        <Section title="What we collect">
          <p>
            When you create a saved card, Kehdoo stores the card text, names you enter, style
            choices, creation time, and a randomly generated card ID so the recipient can open the
            shared link.
          </p>
          <p>
            If you add a photo, the server resizes it, converts it to WebP, and strips metadata
            before storing it. If card saving is unavailable, Kehdoo will not create a share link;
            you can try again once the service is available.
          </p>
          <p>
            If you sign in with Google, Kehdoo receives the account information needed for sign-in
            and uses your account ID to show your saved cards in the dashboard. You can create cards
            without signing in.
          </p>
        </Section>

        <Section title="Cookies & tracking">
          <p>
            Kehdoo uses PostHog for aggregate, privacy-preserving product analytics — such as which
            pages are visited and which buttons are used — so we can see what&apos;s working and fix
            what isn&apos;t. PostHog may also record anonymized session replays (how you move
            through the app) to help us find and fix usability problems; the text of your wish
            message and the recipient/sender names are masked and are never included in these
            recordings. Kehdoo may also use Google Tag Manager to load a small number of marketing
            tags. Kehdoo does not use fingerprinting scripts, and analytics events aren&apos;t
            linked to your identity unless you sign in. If you sign in, Supabase authentication
            cookies keep your session active. Card pages also use local browser storage to avoid
            counting repeated opens from the same session.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Kehdoo uses Supabase for authentication, database storage, and photo storage. Supabase
            processes this data so Kehdoo can provide saved card links and optional dashboards.
          </p>
          <p>
            Kehdoo uses PostHog to understand aggregate product usage. PostHog may process your IP
            address and device/browser information to record these events according to its own{" "}
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              privacy policy
            </a>
            .
          </p>
          <p>
            Kehdoo may use Google Tag Manager to load marketing/advertising tags. Google may
            process your IP address and device/browser information according to its own{" "}
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
            Google provides optional sign-in. Google may process your sign-in request according to
            its own{" "}
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
            When you use the WhatsApp share button or your device&apos;s native share sheet, those
            services handle the share action according to their own privacy policies.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            Saved cards remain available through their private link unless they are removed from the
            service.
          </p>
          <p>
            To request deletion of a saved card or account-related data, contact us from the email
            address associated with your account and include the card link when relevant.
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
        <p>(c) Kehdoo - kehdoo.com</p>
        <nav className="flex gap-4">
          <Link href="/wishes" className="hover:text-foreground">
            Wishes
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </footer>
    </main>
  );
}

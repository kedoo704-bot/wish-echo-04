"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import OverflowMenu from "@/components/OverflowMenu";
import { BrandLogo } from "@/components/BrandLogo";
import { StepHeader } from "@/components/wish-creator/CreatorControls";
import {
  DetailsStep,
  MessageStep,
  OccasionStep,
  PreviewStep,
} from "@/components/wish-creator/CreatorSteps";
import {
  TOTAL_STEPS,
  STEP_LABELS,
} from "@/components/wish-creator/config";
import {
  useWishCreator,
} from "@/components/wish-creator/useWishCreator";

export default function WishCreator() {
  const creator = useWishCreator();

  return (
    <main className="min-h-[100dvh] bg-background/80 text-foreground md:grid md:place-items-center md:bg-transparent md:py-3">
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-background shadow-none md:h-[min(780px,calc(100dvh-24px))] md:rounded-[2.5rem] md:border md:border-border/70 md:shadow-2xl">
        <header className="app-header-gutter safe-top relative z-50 shrink-0 border-b border-border/50 bg-background/92 pb-3 backdrop-blur-xl">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={creator.goBack}
                disabled={creator.step === 0 || creator.saving}
                className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-0"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-w-0 justify-center px-1">
              <Link
                href="/"
                aria-label="Kehdoo home"
                className="inline-flex transition active:scale-95"
              >
                <BrandLogo className="h-8 w-auto max-w-[132px] object-contain" priority />
              </Link>
            </div>

            <div className="flex items-center justify-end">
              <OverflowMenu user={creator.authUser} />
            </div>
          </div>
        </header>

        <div className="app-gutter relative z-40 shrink-0 bg-background/92 py-3 backdrop-blur-xl">
          <StepHeader labels={STEP_LABELS} step={creator.step} />
        </div>

        {creator.notice && (
          <div className="app-gutter shrink-0 pt-3">
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-[13px] leading-5 text-destructive">
              {creator.notice}
            </p>
          </div>
        )}

        <section className="app-gutter min-h-0 flex-1 overflow-y-auto pb-6 pt-5">
          <div
            key={creator.step}
            className={
              creator.transitionDirection === 1
                ? "animate-screen-step-forward"
                : "animate-screen-step-back"
            }
          >
            {creator.step === 0 && (
              <OccasionStep type={creator.type} onSelect={creator.selectOccasion} />
            )}

            {creator.step === 1 && (
              <MessageStep
                currentType={creator.currentType}
                message={creator.message}
                selectedTemplateId={creator.selectedTemplateId}
                templates={creator.templates}
                onMessageChange={creator.setMessage}
                onTemplateSelect={creator.selectTemplate}
              />
            )}

            {creator.step === 2 && (
              <DetailsStep
                from={creator.from}
                photo={creator.photo}
                to={creator.to}
                onFromChange={creator.setFrom}
                onPhotoRemove={creator.removePhoto}
                onPhotoUpload={creator.handlePhotoUpload}
                onToChange={creator.setTo}
              />
            )}

            {creator.step === 3 && (
              <PreviewStep
                bg={creator.bg}
                from={creator.from}
                message={creator.message}
                photo={creator.photo}
                photoY={creator.photoY}
                to={creator.to}
                type={creator.type}
                onBgChange={creator.setBg}
                onPhotoYChange={creator.setPhotoY}
              />
            )}
          </div>
        </section>

        {creator.step > 0 && (
          <footer className="app-gutter safe-bottom relative z-40 shrink-0 border-t border-border/50 bg-background/92 pb-4 pt-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              {creator.step < TOTAL_STEPS - 1 ? (
                <button
                  type="button"
                  onClick={creator.goNext}
                  disabled={!creator.canGoNext}
                  className="btn-3d flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={creator.submit}
                  disabled={creator.saving}
                  className="btn-3d flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  {creator.saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {creator.savingLabel}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create and share
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}

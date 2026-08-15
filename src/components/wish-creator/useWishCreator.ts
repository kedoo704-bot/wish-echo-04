"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { AnalyticsEvent } from "@/lib/analytics-events";
import {
  BACKGROUNDS,
  MESSAGE_TEMPLATES,
  MESSAGE_TYPES,
  type Template,
  type WishPayload,
} from "@/lib/wish";
import { saveCard } from "@/lib/cards";
import { createOptionalClient } from "@/lib/supabase/client";
import {
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PHOTO_BYTES,
  TOTAL_STEPS,
} from "@/components/wish-creator/config";

export type AuthUser = {
  id?: string;
  email?: string;
  user_metadata?: { avatar_url?: string; full_name?: string };
};

export function useWishCreator() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>(MESSAGE_TYPES[0].id);
  const [to, setToRaw] = useState("");
  const [from, setFromRaw] = useState("");
  const [message, setMessageRaw] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [bg, setBg] = useState(BACKGROUNDS[0].id);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoY, setPhotoY] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savingLabel, setSavingLabel] = useState("Creating your card");
  const [notice, setNotice] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const submittingRef = useRef(false);

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setAuthUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  // Sync steps with browser history so the native back gesture / swipe-back
  // (and the hardware back button) walks through steps like an app.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const current = window.history.state as { wishStep?: number } | null;
    if (typeof current?.wishStep !== "number") {
      window.history.replaceState({ ...current, wishStep: 0 }, "");
    }

    const onPop = (event: PopStateEvent) => {
      const state = event.state as { wishStep?: number } | null;
      setTransitionDirection(-1);
      setStep(typeof state?.wishStep === "number" ? state.wishStep : 0);
      setNotice("");
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const currentType = useMemo(
    () => MESSAGE_TYPES.find((item) => item.id === type) ?? MESSAGE_TYPES[0],
    [type]
  );
  const templates = MESSAGE_TEMPLATES[type] ?? [];
  const canGoNext = step !== 1 || message.trim().length > 0;

  const payload: WishPayload = useMemo(
    () => ({
      type,
      to: to.trim(),
      from: from.trim(),
      message: (message || `${currentType.emoji} ${currentType.label}`).trim(),
      theme: "Elegant",
      bg,
      ...(type === "fathers-day" ? { photoY } : {}),
    }),
    [bg, currentType.emoji, currentType.label, from, message, to, type, photoY]
  );

  const setTo = (value: string) => setToRaw(value.slice(0, MAX_NAME_LENGTH));
  const setFrom = (value: string) => setFromRaw(value.slice(0, MAX_NAME_LENGTH));
  const setMessage = (value: string) => {
    setMessageRaw(value.slice(0, MAX_MESSAGE_LENGTH));
    if (selectedTemplateId) setSelectedTemplateId(null);
  };

  // Advance forward by pushing a history entry so back/swipe-back can pop it.
  const pushStep = (next: number) => {
    setTransitionDirection(next >= step ? 1 : -1);
    setStep(next);
    if (typeof window !== "undefined") {
      window.history.pushState({ ...(window.history.state ?? {}), wishStep: next }, "");
    }
  };

  const selectOccasion = (id: string) => {
    setType(id);
    setSelectedTemplateId(null);
    setMessageRaw("");
    setNotice("");
    setPhotoY(0);
    pushStep(1);
  };

  const selectTemplate = (template: Template) => {
    setNotice("");
    if (selectedTemplateId === template.id) {
      setSelectedTemplateId(null);
      setMessageRaw("");
      return;
    }
    setSelectedTemplateId(template.id);
    setMessageRaw(template.text);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNotice("");
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setNotice("That photo is too large. Please choose one under 10 MB.");
      event.target.value = "";
      return;
    }

    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    event.target.value = "";
  };

  const removePhoto = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(null);
    setPhotoFile(null);
  };

  const goBack = () => {
    setNotice("");
    // Let the browser pop history (popstate updates the step), matching the
    // native swipe-back gesture. Fall back to plain state if there's no entry.
    if (step > 0 && typeof window !== "undefined") {
      setTransitionDirection(-1);
      window.history.back();
    } else {
      setTransitionDirection(-1);
      setStep((value) => Math.max(0, value - 1));
    }
  };

  const goNext = () => {
    if (!canGoNext) {
      setNotice("Add a message or choose a template first.");
      return;
    }
    setNotice("");
    pushStep(Math.min(TOTAL_STEPS - 1, step + 1));
  };

  const submit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSaving(true);
    setSavingLabel("Creating your card");
    setNotice("");

    try {
      setSavingLabel(photoFile ? "Optimizing photo" : "Creating your link");
      const id = await saveCard(payload, photoFile);
      posthog.capture(AnalyticsEvent.WISH_CREATED, { wish_type: type, has_photo: !!photoFile });
      router.push(`/share/${id}`);
    } catch {
      setNotice("We couldn't create a short share link. Please try again in a moment.");
      setSaving(false);
      submittingRef.current = false;
    }
  };

  return {
    authUser,
    bg,
    canGoNext,
    currentType,
    from,
    goBack,
    goNext,
    handlePhotoUpload,
    message,
    notice,
    photo,
    photoY,
    removePhoto,
    saving,
    savingLabel,
    selectOccasion,
    selectTemplate,
    selectedTemplateId,
    setBg,
    setFrom,
    setMessage,
    setPhotoY,
    setTo,
    step,
    submit,
    templates,
    to,
    transitionDirection,
    type,
  };
}

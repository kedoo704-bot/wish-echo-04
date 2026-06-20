type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "h-10 w-auto", priority = false }: BrandLogoProps) {
  return (
    <img
      src="/brand/main-logo-lockup.png"
      alt="Kehdoo"
      className={className}
      decoding={priority ? "sync" : "async"}
      loading={priority ? "eager" : "lazy"}
    />
  );
}

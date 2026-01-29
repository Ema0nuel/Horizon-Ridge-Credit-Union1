export function HeroSection({ heading, subtext, image }) {
  return (
    <section className="relative min-h-[400px] sm:min-h-[500px] overflow-hidden bg-gradient-to-br from-basic via-basic/80 to-secondary">
      {/* Floating Shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-20 flex items-center justify-between gap-8">
        {/* Text Content */}
        <div className="flex-1 text-primary">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
            {heading}
          </h1>
          {subtext && (
            <p className="text-lg sm:text-xl opacity-90 max-w-xl leading-relaxed">
              {subtext}
            </p>
          )}
        </div>

        {/* Image */}
        {image && (
          <div className="hidden lg:flex flex-1 relative justify-center">
            <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-2xl">
              <img
                src={image}
                alt={heading}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

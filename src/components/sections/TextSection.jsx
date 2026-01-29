export function TextSection({ content, alignment = "left" }) {
  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="container mx-auto max-w-4xl px-4">
        <div
          className={`text-lg sm:text-xl leading-relaxed text-secondary ${
            alignment === "center" ? "text-center" : "text-left"
          }`}
        >
          {content}
        </div>
      </div>
    </section>
  );
}

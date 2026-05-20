import { Text } from "@/components/ds/Text";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Reserve Your Spot",
      description:
        "Choose your preferred date and secure your seat for an intimate candle-making experience.",
      icon: "✦",
    },
    {
      number: "02",
      title: "Select Your Fragrance & Vessel",
      description:
        "Explore our curated collection of luxury fragrances and elegant containers to create a candle that feels uniquely yours.",
      icon: "🕯️",
    },
    {
      number: "03",
      title: "Blend Fragrances at the Bar",
      description:
        "Take your seat at our fragrance bar and craft a custom scent by mixing notes together with guidance from our team.",
      icon: "✨",
    },
    {
      number: "04",
      title: "Relax During Cooldown",
      description:
        "Unwind in our lounge with music, conversation, and ambiance while your candle cools and sets beautifully.",
      icon: "☕",
    },
  ];

  return (
    <section className="bg-[#f8f5f1] px-6 py-24 text-neutral-900">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Text
            size="sm"
            className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500"
          >
            The Experience
          </Text>

          <Text
            size="md"
            className="text-4xl font-light tracking-tight md:text-5xl"
          >
            How Our Candle Classes Work
          </Text>

          <Text
            size="sm"
            className="mt-6 text-lg md:text-xl leading-relaxed text-neutral-600"
          >
            Designed to be warm, social, and immersive — our candle classes
            combine creativity, fragrance, and relaxation into one elevated
            experience.
          </Text>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/80 p-8 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                  {step.icon}
                </div>

                <span className="text-sm tracking-[0.25em] text-neutral-400">
                  {step.number}
                </span>
              </div>

              <div className="mt-8">
                <Text
                  size="md"
                  className="text-2xl font-semibold tracking-tight"
                >
                  {step.title}
                </Text>

                <Text
                  size="sm"
                  className="mt-4 text-base leading-relaxed text-neutral-600"
                >
                  {step.description}
                </Text>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-300 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

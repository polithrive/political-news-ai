import Image from "next/image";

export default function CapitolBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Image
        src="/polithrive-capitol-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_40%] opacity-[0.72]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,13,33,0.78)_0%,rgba(2,13,33,0.52)_36%,rgba(2,13,33,0.22)_64%,rgba(2,13,33,0.38)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#020D21]/80 to-transparent" />
    </div>
  );
}

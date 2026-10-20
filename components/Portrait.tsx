import Image from "next/image";
import samuel from "@/public/images/samuel.webp";

// Crisp 4:5 frame, full color, no mask or blend. The crop is proportional, so it holds at both sizes:
// ~35px headroom above the hair at 320×400, eyes at ~40%, neckline at the bottom edge.
export function Portrait() {
  return (
    <div className="h-[175px] w-[140px] shrink-0 overflow-hidden md:h-[400px] md:w-80">
      <Image
        src={samuel}
        alt="Samuel, looking straight at the camera"
        priority
        sizes="(max-width: 720px) 140px, 320px"
        className="h-full w-full origin-[50%_35%] scale-[1.15] object-cover object-[50%_100%]"
      />
    </div>
  );
}

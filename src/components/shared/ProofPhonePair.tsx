import Image from "next/image";
import type { ReactNode } from "react";

export type ProofPhoneItem = {
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
};

type ProofPhonePairProps = {
  phones: [ProofPhoneItem, ProofPhoneItem];
  badge?: ReactNode;
  className?: string;
};

export default function ProofPhonePair({ phones, badge, className = "" }: ProofPhonePairProps) {
  const [primary, secondary] = phones;

  return (
    <div className={`proof-phone-pair ${className}`.trim()}>
      {badge}

      <div className="proof-phone-pair-grid">
        {[primary, secondary].map((phone, index) => (
          <figure
            key={phone.src}
            className={`proof-phone-pair-item ${index === 1 ? "proof-phone-pair-item--secondary" : ""}`}
          >
            <div className="proof-phone-pair-screen">
              <Image
                src={phone.src}
                alt={phone.alt}
                width={phone.width ?? 390}
                height={phone.height ?? 844}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 40vw, 188px"
              />
            </div>
            <figcaption className="proof-phone-pair-label">{phone.label}</figcaption>
          </figure>
        ))}
      </div>

      <p className="proof-phone-pair-footnote">Live MT5 mobile · funded account</p>
    </div>
  );
}

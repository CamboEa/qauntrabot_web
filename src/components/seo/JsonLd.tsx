import { FAQ_ITEMS } from "@/lib/faq-data";
import { SITE_NAME } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function SiteJsonLd() {
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo/logo.png`,
          description:
            "Institutional-grade Expert Advisors and algorithmic trading bots for MetaTrader 4 and 5.",
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/bots?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
      ]}
    />
  );
}

export function FaqPageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }}
    />
  );
}

type BotJsonLdInput = {
  id: string;
  name: string;
  description: string;
  asset: string;
};

export function BotProductJsonLd({ id, name, description, asset }: BotJsonLdInput) {
  const url = `${SITE_URL}/bots/${id}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "MetaTrader 4, MetaTrader 5",
        url,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/pricing`,
          availability: "https://schema.org/InStock",
        },
        featureList: asset,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
      }}
    />
  );
}

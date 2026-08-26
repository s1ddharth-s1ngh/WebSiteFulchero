import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /** Variante compatta, usata nella barra superiore. */
  piccolo?: boolean;
  /** Comparsa animata all'ingresso nel viewport. */
  reveal?: boolean;
  title?: string;
};

/** `tel:` e `mailto:` non sono navigazioni: vanno su un `<a>` normale. */
const eProtocollo = (href: string) => /^(tel:|mailto:|https?:)/.test(href);

export function Button({ href, children, piccolo = false, reveal = false, title }: Props) {
  const classi = ["mil-button", piccolo && "mil-sm", reveal && "mil-up"].filter(Boolean).join(" ");

  if (eProtocollo(href)) {
    return (
      <a href={href} className={classi} title={title}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classi} title={title}>
      {children}
    </Link>
  );
}

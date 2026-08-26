import Link from "next/link";

export type Briciola = {
  href: string;
  etichetta: string;
};

type Props = {
  voci: readonly Briciola[];
  /** Allineamento al centro, come nei banner delle pagine interne. */
  centrato?: boolean;
};

export function Breadcrumbs({ voci, centrato = false }: Props) {
  const ultima = voci.length - 1;

  return (
    <nav aria-label="Percorso di navigazione">
      <ul className={`mil-breadcrumbs${centrato ? " mil-center" : ""}`}>
        {voci.map((voce, indice) => (
          <li key={voce.href}>
            {/* L'ultima voce punta alla pagina che si sta guardando: resta un
                link come nel tema, ma dichiarato come tale alle tecnologie
                assistive invece di sembrare una destinazione diversa. */}
            <Link href={voce.href} aria-current={indice === ultima ? "page" : undefined}>
              {voce.etichetta}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

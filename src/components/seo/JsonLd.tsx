/**
 * Inserisce un blocco di dati strutturati schema.org.
 *
 * La sequenza `</script>` dentro un valore chiuderebbe il tag in anticipo e il
 * resto finirebbe nella pagina come markup: viene quindi neutralizzata,
 * lasciando il JSON valido.
 */
export function JsonLd({ dati }: { dati: object }) {
  const json = JSON.stringify(dati).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

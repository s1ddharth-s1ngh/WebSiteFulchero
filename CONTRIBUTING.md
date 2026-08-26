# Convenzioni di lavoro

## Commit

**Un commit per ogni unita di lavoro.** Ogni task, sotto-task e sotto-sotto-task
si chiude con il proprio commit e il push immediato su `main`. Non si
raggruppano piu unita di lavoro in un unico commit: la storia deve permettere di
seguire l'avanzamento passo per passo dalla pagina Commits di GitHub.

**Nessuna co-autoria.** I messaggi di commit non devono contenere trailer
`Co-Authored-By`. L'autore di ogni commit e unicamente:

```
Singh-Growe <account@growe.dev>
```

Se un commit dovesse finire nella storia con un trailer di co-autoria, va
riscritto e ripushato:

```bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f \
  --msg-filter 'sed "/^Co-Authored-By:/d"' -- --all
git push --force origin main
```

### Formato del messaggio

```
<tipo>(<ambito>): <descrizione breve> (<codice task>)

Corpo che spiega il perche della modifica, non solo il cosa.
```

- Lingua: italiano.
- Tipi: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`, `perf`.
- Il codice task (`F1.2`, `F7.5`, ...) fa riferimento al piano di conversione
  descritto in `MIGRATION.md`.

Esempio:

```
fix(assets): rinominare portfolio-14.JPG e aggiungere il guard sul case (F1.2)

Nel progetto ASP.NET il markup referenzia img/arch/portfolio-14.jpg mentre il
file su disco si chiama portfolio-14.JPG. Su NTFS funziona, su qualunque host
Linux e un 404 silenzioso.
```

## Verifiche prima del commit

```bash
npm run check     # lint + typecheck + check:assets + format:check
```

I singoli passi:

| Comando                | Cosa verifica                                           |
| ---------------------- | ------------------------------------------------------- |
| `npm run lint`         | regole ESLint di Next 16 (core-web-vitals + typescript) |
| `npm run typecheck`    | TypeScript in modalita strict, senza emissione          |
| `npm run check:assets` | ogni `/img/...` citato nel codice esiste in `public/`   |
| `npm run format:check` | formattazione Prettier                                  |

## Stile del codice

- Componenti server per default; `"use client"` solo dove serve stato,
  effetti o listener del DOM.
- Le classi del design system restano quelle originali del tema (`mil-*`):
  non vanno rinominate, il CSS portato da `style.css` ci si appoggia.
- I contenuti testuali vivono in `src/data/`, non dentro il JSX.
- I dati anagrafici dello studio vivono in `src/lib/site.ts`: non duplicarli.

const interventions = [
  {
    client: "Entreprise ABC",
    type: "Maintenance",
    date: "Aujourd’hui",
    adresse: "Bordeaux",
    statut: "Terminée",
  },
  {
    client: "Résidence Les Pins",
    type: "Diagnostic",
    date: "Hier",
    adresse: "Mérignac",
    statut: "En cours",
  },
  {
    client: "Atelier Martin",
    type: "Installation",
    date: "12 juin",
    adresse: "Pessac",
    statut: "Terminée",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* En-tête */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight text-slate-950">
              FieldAI
            </p>
            <p className="text-sm text-slate-500">Vos interventions</p>
          </div>

          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800"
            aria-label="Profil"
          >
            V
          </div>
        </header>

        {/* Bloc principal */}
        <section
          aria-labelledby="welcome-title"
          className="mt-8 overflow-hidden rounded-3xl bg-emerald-950 px-6 py-8 text-white shadow-sm sm:mt-10 sm:px-10 sm:py-10"
        >
          <p className="text-sm font-medium text-emerald-300">
            Le rapport d’intervention professionnel en 2 minutes.
          </p>

          <h1
            id="welcome-title"
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Bonjour 👋
          </h1>

          <p className="mt-2 max-w-xl text-lg text-emerald-50">
            Prêt pour votre prochaine intervention ?
          </p>

          <a
            href="/interventions/nouvelle"
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              +
            </span>
            Nouvelle intervention
          </a>
        </section>

        {/* Interventions récentes */}
        <section
          aria-labelledby="recent-title"
          className="mt-10 sm:mt-12"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="recent-title"
                className="text-xl font-bold tracking-tight text-slate-950"
              >
                Interventions récentes
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Retrouvez rapidement vos dernières interventions.
              </p>
            </div>

            <a
              href="/interventions/historique"
              className="inline-flex min-h-11 items-center font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-950 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            >
              Voir toutes les interventions
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </a>
          </div>

          <ul className="mt-5 space-y-3">
            {interventions.map((intervention) => (
              <li
                key={`${intervention.client}-${intervention.type}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      {intervention.client}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {intervention.type}
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                      <span>{intervention.date}</span>

                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>

                      <span>{intervention.adresse}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex min-h-9 w-fit items-center rounded-full px-3 text-sm font-medium ${
                      intervention.statut === "Terminée"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    <span
                      className="mr-2 h-2 w-2 rounded-full bg-current"
                      aria-hidden="true"
                    />

                    {intervention.statut}
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Message de développement */}
        <p className="mt-8 pb-4 text-center text-xs text-slate-500">
          Les interventions affichées sont actuellement des exemples fictifs.
        </p>
      </div>
    </main>
  );
}
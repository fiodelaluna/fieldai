"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CLE_STOCKAGE = "fieldai-interventions";

type Intervention = {
  id: string;
  client?: string;
  adresse?: string;
  type?: string;
  dateCreation?: string;
  statut?: string;
};

export default function HistoriqueInterventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [charge, setCharge] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    try {
      const donnees = localStorage.getItem(CLE_STOCKAGE);

      if (donnees) {
        const resultat: unknown = JSON.parse(donnees);

        if (Array.isArray(resultat)) {
          setInterventions(resultat);
        } else {
          setErreur("Les données enregistrées ne sont pas au bon format.");
        }
      }
    } catch {
      setErreur("Impossible de lire les interventions enregistrées.");
    } finally {
      setCharge(true);
    }
  }, []);

  const formaterDate = (date?: string) => {
    if (!date) return "Date non renseignée";

    const valeurDate = new Date(date);

    if (Number.isNaN(valeurDate.getTime())) {
      return "Date non renseignée";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(valeurDate);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            ← Retour à l’accueil
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Historique des interventions
          </h1>

          <p className="mt-2 text-slate-700">
            Retrouvez les interventions enregistrées dans ce navigateur.
          </p>
        </header>

        <div className="mb-6">
          <Link
            href="/interventions/nouvelle"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            Créer une intervention
          </Link>
        </div>

        {erreur && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {erreur}
          </p>
        )}

        {!charge ? (
          <p role="status" className="py-8 text-slate-700">
            Chargement des interventions…
          </p>
        ) : !erreur && interventions.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Aucune intervention pour le moment
            </h2>
            <p className="mt-2 text-slate-700">
              Les interventions créées apparaîtront ici.
            </p>
          </section>
        ) : (
          <ul className="space-y-4">
            {interventions.map((intervention) => (
              <li key={intervention.id}>
                <Link
                  href={`/interventions/${encodeURIComponent(intervention.id)}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <article>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="text-lg font-bold">
                        {intervention.client || "Client non renseigné"}
                      </h2>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-950">
                        {intervention.statut || "Statut non renseigné"}
                      </span>
                    </div>

                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold">Type :</dt>
                        <dd>{intervention.type || "Non renseigné"}</dd>
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold">Adresse :</dt>
                        <dd>{intervention.adresse || "Non renseignée"}</dd>
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold">Créée le :</dt>
                        <dd>{formaterDate(intervention.dateCreation)}</dd>
                      </div>
                    </dl>

                    <p className="mt-4 text-sm font-semibold text-emerald-800">
                      Voir le détail →
                    </p>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
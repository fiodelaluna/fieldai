"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CLE_STOCKAGE = "fieldai-interventions";

type ElementChecklist = {
  id: number | string;
  label: string;
  checked?: boolean;
};

type PhotoIntervention = {
  id: string;
  nom: string;
  donnees: string;
};

type Intervention = {
  id: string;
  client?: string;
  adresse?: string;
  type?: string;
  dateCreation?: string;
  statut?: string;
  description?: string;
  observations?: string;
  checklist?: ElementChecklist[];
  photos?: PhotoIntervention[];
};

export default function DetailIntervention() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [charge, setCharge] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    try {
      const donnees = localStorage.getItem(CLE_STOCKAGE);

      if (!donnees) {
        setCharge(true);
        return;
      }

      const resultat: unknown = JSON.parse(donnees);

      if (!Array.isArray(resultat)) {
        setErreur("Les données enregistrées ne sont pas au bon format.");
        setCharge(true);
        return;
      }

      const element = resultat.find(
        (item): item is Intervention =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          item.id === id
      );

      if (element) {
        setIntervention(element);
      }

      setCharge(true);
    } catch {
      setErreur("Impossible de lire les interventions enregistrées.");
      setCharge(true);
    }
  }, [id]);

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

  const afficherValeur = (valeur?: string) => valeur?.trim() || "Non renseigné";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/interventions/historique"
            className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            ← Retour à l’historique
          </Link>
        </header>

        {!charge ? (
          <p role="status" className="py-8 text-slate-700">
            Chargement de l’intervention…
          </p>
        ) : erreur ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {erreur}
          </p>
        ) : !intervention ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">Intervention introuvable</h1>
            <p className="mt-2 text-slate-700">
              Elle n’existe pas dans les interventions enregistrées dans ce
              navigateur.
            </p>
          </section>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {intervention.client || "Client non renseigné"}
                </h1>
                <p className="mt-2 text-slate-700">
                  Détail de l’intervention
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Imprimer
              </button>
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-950">
                {intervention.statut || "Statut non renseigné"}
              </span>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">Informations générales</h2>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-slate-600">
                    Adresse
                  </dt>
                  <dd className="mt-1">
                    {afficherValeur(intervention.adresse)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-600">
                    Type d’intervention
                  </dt>
                  <dd className="mt-1">
                    {afficherValeur(intervention.type)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-slate-600">
                    Date de création
                  </dt>
                  <dd className="mt-1">
                    {formaterDate(intervention.dateCreation)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-3 whitespace-pre-wrap text-slate-700">
                {afficherValeur(intervention.description)}
              </p>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">Observations</h2>
              <p className="mt-3 whitespace-pre-wrap text-slate-700">
                {afficherValeur(intervention.observations)}
              </p>
            </section>

            {intervention.checklist &&
              intervention.checklist.length > 0 && (
                <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold">Checklist</h2>

                  <ul className="mt-4 space-y-3">
                    {intervention.checklist.map((element) => (
                      <li
                        key={element.id}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <span aria-hidden="true">
                          {element.checked ? "☑" : "☐"}
                        </span>
                        <span>{element.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {intervention.photos && intervention.photos.length > 0 && (
              <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold">Photos</h2>

                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {intervention.photos.map((photo) => (
                    <li key={photo.id}>
                      <a
                        href={photo.donnees}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.donnees}
                          alt={`Photo de l’intervention : ${photo.nom}`}
                          className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                        />
                        <span className="mt-2 block break-all text-sm text-slate-600">
                          {photo.nom}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const CLE_STOCKAGE = "fieldai-interventions";
const NOMBRE_MAX_PHOTOS = 3;
const TAILLE_MAX_PHOTO = 750 * 1024; // 750 Ko par photo

const typesIntervention = [
  "Maintenance",
  "Diagnostic",
  "Installation",
  "Inspection",
  "Dépannage",
  "Autre",
];

type ElementChecklist = {
  id: number;
  label: string;
  checked: boolean;
};

type PhotoIntervention = {
  id: string;
  nom: string;
  donnees: string;
};

const checklistInitiale: ElementChecklist[] = [
  { id: 1, label: "Équipement identifié", checked: false },
  { id: 2, label: "Contrôle visuel effectué", checked: false },
  { id: 3, label: "Tests effectués", checked: false },
  { id: 4, label: "Anomalies relevées", checked: false },
];

export default function NouvelleIntervention() {
  const [client, setClient] = useState("");
  const [adresse, setAdresse] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [observations, setObservations] = useState("");
  const [checklist, setChecklist] = useState(checklistInitiale);
  const [photos, setPhotos] = useState<PhotoIntervention[]>([]);
  const [messageErreur, setMessageErreur] = useState("");

  const toggleChecklist = (id: number) => {
    setChecklist((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const lirePhoto = (fichier: File): Promise<PhotoIntervention> =>
    new Promise((resolve, reject) => {
      const lecteur = new FileReader();

      lecteur.onload = () => {
        if (typeof lecteur.result !== "string") {
          reject(new Error("Impossible de lire cette photo."));
          return;
        }

        resolve({
          id: `${Date.now()}-${Math.random()}`,
          nom: fichier.name,
          donnees: lecteur.result,
        });
      };

      lecteur.onerror = () => reject(new Error("Impossible de lire cette photo."));
      lecteur.readAsDataURL(fichier);
    });

  const ajouterPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const fichiers = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (fichiers.length === 0) return;

    setMessageErreur("");

    const placesDisponibles = NOMBRE_MAX_PHOTOS - photos.length;

    if (placesDisponibles <= 0) {
      setMessageErreur(`Vous pouvez ajouter au maximum ${NOMBRE_MAX_PHOTOS} photos.`);
      return;
    }

    const fichiersSelectionnes = fichiers.slice(0, placesDisponibles);
    const photoTropVolumineuse = fichiersSelectionnes.find(
      (fichier) => fichier.size > TAILLE_MAX_PHOTO
    );

    if (photoTropVolumineuse) {
      setMessageErreur(
        `Chaque photo doit faire moins de 750 Ko. « ${photoTropVolumineuse.name} » est trop volumineuse.`
      );
      return;
    }

    const fichierInvalide = fichiersSelectionnes.find(
      (fichier) => !fichier.type.startsWith("image/")
    );

    if (fichierInvalide) {
      setMessageErreur("Sélectionnez uniquement des fichiers image.");
      return;
    }

    try {
      const nouvellesPhotos = await Promise.all(
        fichiersSelectionnes.map(lirePhoto)
      );

      setPhotos((photosActuelles) => [...photosActuelles, ...nouvellesPhotos]);
    } catch {
      setMessageErreur("Impossible de lire une ou plusieurs photos sélectionnées.");
    }
  };

  const supprimerPhoto = (id: string) => {
    setPhotos((photosActuelles) =>
      photosActuelles.filter((photo) => photo.id !== id)
    );
  };

  const checklistComplete = checklist.filter((item) => item.checked).length;

  const creerIntervention = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessageErreur("");

    const nouvelleIntervention = {
      id: Date.now().toString(),
      client,
      adresse,
      type,
      description,
      observations,
      checklist,
      photos,
      dateCreation: new Date().toISOString(),
      statut: "Terminée",
    };

    try {
      const interventionsEnregistrees = localStorage.getItem(CLE_STOCKAGE);
      const interventions = interventionsEnregistrees
        ? JSON.parse(interventionsEnregistrees)
        : [];

      if (!Array.isArray(interventions)) {
        throw new Error("Les données enregistrées ne sont pas valides.");
      }

      interventions.unshift(nouvelleIntervention);
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(interventions));

      alert("Intervention enregistrée dans ce navigateur.");
    } catch {
      setMessageErreur(
        "Impossible d’enregistrer l’intervention. Le stockage du navigateur est peut-être plein. Essayez de retirer des photos."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8">
          <a
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-emerald-800"
          >
            ← Retour
          </a>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            Nouvelle intervention
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Renseignez les informations de votre intervention.
          </p>
        </header>

        <form onSubmit={creerIntervention} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Informations client
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="client"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Client
                </label>
                <input
                  id="client"
                  type="text"
                  required
                  value={client}
                  onChange={(event) => setClient(event.target.value)}
                  placeholder="Nom du client ou de l'entreprise"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="adresse"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Adresse
                </label>
                <input
                  id="adresse"
                  type="text"
                  required
                  value={adresse}
                  onChange={(event) => setAdresse(event.target.value)}
                  placeholder="Adresse de l'intervention"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Type d’intervention
                </label>
                <select
                  id="type"
                  required
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Sélectionner un type</option>
                  {typesIntervention.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Intervention</h2>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Décrivez la demande du client ou l'intervention réalisée..."
                  rows={5}
                  className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="observations"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Observations
                </label>
                <textarea
                  id="observations"
                  value={observations}
                  onChange={(event) => setObservations(event.target.value)}
                  placeholder="Ajoutez vos observations, mesures ou remarques..."
                  rows={5}
                  className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Checklist</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Vérifiez les points importants.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                {checklistComplete}/{checklist.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.checked}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex min-h-14 w-full items-center gap-4 rounded-xl border px-4 text-left transition ${
                    item.checked
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${
                      item.checked
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      item.checked ? "text-emerald-900" : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Photos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ajoutez jusqu’à {NOMBRE_MAX_PHOTOS} photos (750 Ko maximum
              chacune).
            </p>

            <label
              htmlFor="photos"
              className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              <span className="text-3xl" aria-hidden="true">
                📷
              </span>
              <span className="mt-2 text-sm font-semibold text-slate-800">
                Choisir des photos
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Sur mobile, vous pourrez utiliser l’appareil photo si votre
                navigateur le propose.
              </span>
            </label>

            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={ajouterPhotos}
              disabled={photos.length >= NOMBRE_MAX_PHOTOS}
              className="sr-only"
            />

            {photos.length > 0 && (
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {photos.map((photo) => (
                  <li
                    key={photo.id}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.donnees}
                      alt={`Aperçu de ${photo.nom}`}
                      className="h-40 w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="truncate text-sm text-slate-700">
                        {photo.nom}
                      </span>
                      <button
                        type="button"
                        onClick={() => supprimerPhoto(photo.id)}
                        aria-label={`Supprimer ${photo.nom}`}
                        className="min-h-10 shrink-0 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-emerald-950">Résumé</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-emerald-800">Client</span>
                <span className="text-right font-semibold text-emerald-950">
                  {client || "Non renseigné"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-800">Adresse</span>
                <span className="text-right font-semibold text-emerald-950">
                  {adresse || "Non renseignée"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-800">Type</span>
                <span className="text-right font-semibold text-emerald-950">
                  {type || "Non renseigné"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-800">Checklist</span>
                <span className="font-semibold text-emerald-950">
                  {checklistComplete}/{checklist.length}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-800">Photos</span>
                <span className="font-semibold text-emerald-950">
                  {photos.length}/{NOMBRE_MAX_PHOTOS}
                </span>
              </div>
            </div>
          </section>

          {messageErreur && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
            >
              {messageErreur}
            </p>
          )}

          <button
            type="submit"
            className="min-h-14 w-full rounded-xl bg-emerald-800 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            Créer l’intervention
          </button>

          <p className="pb-6 text-center text-xs text-slate-500">
            Les données et photos sont enregistrées uniquement dans ce
            navigateur.
          </p>
        </form>
      </div>
    </main>
  );
}
import { AppError } from '@/shared/errors/AppError';

// Client HTTP minimal autour de fetch : URL de base, délai maximal, erreurs typées.
// Les variables EXPO_PUBLIC_* sont injectées dans le bundle au démarrage de Metro (fichier .env.local).
// Sans elle, on vise l'ordinateur : sur le simulateur iOS, `localhost` atteint le Mac.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TIMEOUT_MS = 8000;

export class ApiError extends AppError {
  // Code HTTP ; 0 = pas de réponse (réseau coupé, serveur arrêté, délai dépassé).
  public readonly status: number;

  constructor(status: number, message: string, userMessage: string, code?: string, technicalDetails?: unknown) {
    super(message, userMessage, code, technicalDetails);
    this.status = status;
  }

  static unreachable(technicalDetails?: unknown): ApiError {
    return new ApiError(
      0,
      'unreachable',
      `Serveur injoignable (${BASE_URL}). L'API est-elle démarrée ?`,
      'unreachable',
      technicalDetails,
    );
  }

  static httpError(status: number, path: string): ApiError {
    return new ApiError(
      status,
      `http_${status}`,
      `Le serveur a répondu par une erreur (${status}).`,
      'http_error',
      { path },
    );
  }
}

// Méthodes HTTP utilisées par l'application : GET lit, POST crée, PATCH modifie une partie d'une ressource,
// DELETE la supprime.
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  method?: HttpMethod;
  /** Objet envoyé au serveur, converti en JSON. */
  body?: unknown;
}

// Renvoie le corps JSON de la réponse, sans le typer : c'est au service de le VALIDER.
export async function apiFetch(path: string, options: ApiRequestOptions = {}): Promise<unknown> {
  const { method = 'GET', body } = options;
  // AbortController : une « télécommande » qui annule la requête. Au bout de 8 s sans réponse,
  // on appuie dessus : fetch échoue au lieu d'attendre indéfiniment un serveur muet.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const hasBody = body !== undefined;
  // Content-Type prévient le serveur que le corps est du JSON (sinon il ne saurait pas le lire).
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (hasBody) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    // fetch ne lève une exception QUE s'il n'y a aucune réponse : réseau coupé, serveur arrêté, délai dépassé.
    throw ApiError.unreachable(error);
  } finally {
    clearTimeout(timer);
  }

  // Une 404 ou une 500 est une RÉPONSE : fetch ne lève rien. `response.ok` vaut true
  // seulement pour un statut 200 à 299 : c'est à nous de transformer le reste en erreur.
  if (!response.ok) {
    throw ApiError.httpError(response.status, path);
  }
  return response.json();
}

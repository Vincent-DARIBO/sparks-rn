import type { QueryClient } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createTestQueryClient, createWrapper } from '@/test/queryClientWrapper';

import { ProductService } from '../../services/ProductService';
import { MAX_QUANTITY, type Product } from '../../types';
import { productKeys } from '../productKeys';
import useAdjustQuantity from '../useAdjustQuantity';

/**
 * Le service est remplacé par une doublure (`jest.spyOn`) : pas de réseau, pas de json-server,
 * et c'est le test qui choisit la réponse (succès, échec, lenteur). Un faux serveur ajouterait
 * une pièce à configurer sans rien tester de plus : la règle à vérifier est dans le hook.
 */
const nutella: Product = {
  id: '1',
  barcode: '3017620422003',
  name: 'Pâte à tartiner 400 g',
  brand: 'Nutella',
  category: 'petit-dejeuner',
  quantity: 24,
  minQuantity: 10,
};

// Une promesse que le test résout ou rejette QUAND IL LE DÉCIDE : tant qu'elle n'est pas réglée,
// le serveur « n'a pas répondu », et on peut observer l'état du cache pendant la requête.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const withQuantity = (quantity: number): Product => ({ ...nutella, quantity });

const listQuantity = (client: QueryClient) =>
  client.getQueryData<Product[]>(productKeys.list())?.find((p) => p.id === nutella.id)?.quantity;
const detailQuantity = (client: QueryClient) =>
  client.getQueryData<Product>(productKeys.detail(nutella.id))?.quantity;

// Cache neuf, avec la liste ET la fiche remplies : le hook lit et écrit dans les deux.
function createClientWithProduct(quantity: number) {
  const client = createTestQueryClient();
  client.setQueryData(productKeys.list(), [withQuantity(quantity)]);
  client.setQueryData(productKeys.detail(nutella.id), withQuantity(quantity));
  return client;
}

// Signal sans ambiguïté : plus aucune mutation en cours dans ce cache.
const waitUntilSettled = (client: QueryClient) => waitFor(() => expect(client.isMutating()).toBe(0));

async function renderAdjustQuantity(client: QueryClient, onError?: (error: Error) => void) {
  const { result } = await renderHook(() => useAdjustQuantity({ onError }), { wrapper: createWrapper(client) });
  return result;
}

describe('useAdjustQuantity', () => {
  beforeEach(() => {
    // Filet de sécurité : l'invalidation finale ne recharge que les requêtes affichées par un
    // composant, et ces tests n'en ont aucune, donc ces doublures ne devraient jamais servir.
    // Si elles servaient un jour, elles renvoient une quantité (99) qu'aucun test n'attend :
    // le test échouerait au lieu de laisser une valeur plausible masquer un défaut.
    jest.spyOn(ProductService, 'list').mockResolvedValue([withQuantity(99)]);
    jest.spyOn(ProductService, 'get').mockResolvedValue(withQuantity(99));
  });

  // Les doublures survivent d'un test à l'autre si on ne les retire pas : on remet les vraies méthodes.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('met à jour le cache (liste et fiche) AVANT la réponse du serveur', async () => {
    const client = createClientWithProduct(24);
    const server = deferred<Product>();
    jest.spyOn(ProductService, 'update').mockReturnValue(server.promise);
    const result = await renderAdjustQuantity(client);

    await act(async () => {
      result.current.adjustQuantity(nutella.id, -1);
    });

    // Le serveur n'a pas encore répondu, et les deux caches affichent déjà 23.
    await waitFor(() => expect(listQuantity(client)).toBe(23));
    expect(detailQuantity(client)).toBe(23);
    await waitFor(() => expect(result.current.isAdjustingQuantity).toBe(true));

    await act(async () => {
      server.resolve(withQuantity(23));
    });
    await waitUntilSettled(client);
  });

  it('restaure la quantité précédente si le serveur échoue', async () => {
    const client = createClientWithProduct(24);
    const onError = jest.fn();
    const update = jest.spyOn(ProductService, 'update').mockRejectedValue(new Error('Serveur injoignable'));
    const result = await renderAdjustQuantity(client, onError);

    await act(async () => {
      result.current.adjustQuantity(nutella.id, -1);
    });

    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    await waitUntilSettled(client);
    // On vérifie le RÉSULTAT (la quantité est revenue), pas la façon dont le hook y parvient.
    expect(listQuantity(client)).toBe(24);
    expect(detailQuantity(client)).toBe(24);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('envoie une quantité ABSOLUE calculée à partir du cache, pas un écart', async () => {
    const client = createClientWithProduct(24);
    const update = jest.spyOn(ProductService, 'update').mockResolvedValue(withQuantity(19));
    const result = await renderAdjustQuantity(client);

    await act(async () => {
      result.current.adjustQuantity(nutella.id, -5);
    });

    // 24 - 5 = 19 : on envoie 19, jamais -5.
    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    await waitUntilSettled(client);
    expect(update).toHaveBeenCalledWith(nutella.id, { quantity: 19 });
  });

  it('ne descend jamais sous zéro', async () => {
    const client = createClientWithProduct(2);
    const update = jest.spyOn(ProductService, 'update').mockResolvedValue(withQuantity(0));
    const result = await renderAdjustQuantity(client);

    await act(async () => {
      result.current.adjustQuantity(nutella.id, -5);
    });

    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    await waitUntilSettled(client);
    expect(update).toHaveBeenCalledWith(nutella.id, { quantity: 0 });
  });

  describe('compléments propres à ce hook (hors ticket)', () => {
    it('ne dépasse jamais la quantité maximale', async () => {
      const client = createClientWithProduct(MAX_QUANTITY - 1);
      const update = jest.spyOn(ProductService, 'update').mockResolvedValue(withQuantity(MAX_QUANTITY));
      const result = await renderAdjustQuantity(client);

      await act(async () => {
        result.current.adjustQuantity(nutella.id, 5);
      });

      await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
      await waitUntilSettled(client);
      expect(update).toHaveBeenCalledWith(nutella.id, { quantity: MAX_QUANTITY });
    });

    it('deux appuis rapides envoient deux quantités absolues, dans l’ordre', async () => {
      const client = createClientWithProduct(24);
      const firstRequest = deferred<Product>();
      const update = jest
        .spyOn(ProductService, 'update')
        .mockReturnValueOnce(firstRequest.promise)
        .mockResolvedValueOnce(withQuantity(22));
      const result = await renderAdjustQuantity(client);

      await act(async () => {
        result.current.adjustQuantity(nutella.id, -1);
      });
      await act(async () => {
        result.current.adjustQuantity(nutella.id, -1);
      });

      // Le second appui part du cache déjà modifié (23), pas de la valeur du serveur (24).
      // Les requêtes sont en série : la seconde attend que la première soit terminée.
      expect(listQuantity(client)).toBe(22);
      expect(update).toHaveBeenCalledTimes(1);

      await act(async () => {
        firstRequest.resolve(withQuantity(23));
      });
      await waitFor(() => expect(update).toHaveBeenCalledTimes(2));
      await waitUntilSettled(client);
      expect(update).toHaveBeenNthCalledWith(1, nutella.id, { quantity: 23 });
      expect(update).toHaveBeenNthCalledWith(2, nutella.id, { quantity: 22 });
    });

    it('revient à la valeur d’origine après deux échecs successifs', async () => {
      const client = createClientWithProduct(24);
      const onError = jest.fn();
      const firstRequest = deferred<Product>();
      const update = jest
        .spyOn(ProductService, 'update')
        .mockReturnValueOnce(firstRequest.promise)
        .mockRejectedValueOnce(new Error('Serveur injoignable'));
      const result = await renderAdjustQuantity(client, onError);

      await act(async () => {
        result.current.adjustQuantity(nutella.id, -1);
      });
      await act(async () => {
        result.current.adjustQuantity(nutella.id, -1);
      });
      await act(async () => {
        firstRequest.reject(new Error('Serveur injoignable'));
      });

      await waitFor(() => expect(update).toHaveBeenCalledTimes(2));
      await waitUntilSettled(client);
      expect(listQuantity(client)).toBe(24);
      expect(detailQuantity(client)).toBe(24);
      expect(onError).toHaveBeenCalledTimes(2);
    });
  });
});

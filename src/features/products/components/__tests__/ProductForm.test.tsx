import { render, screen, userEvent } from '@testing-library/react-native';

import type { ProductFormValues } from '../../schema';
import ProductForm from '../ProductForm';

/**
 * On teste ce que voit et fait l'utilisateur : des libellés, des textes, des appuis.
 * Jamais l'état interne de React Hook Form : ainsi, un test ne casse pas quand on change
 * l'implémentation (par exemple le mode de validation), seulement quand le comportement change.
 */
const emptyValues = { name: '', brand: '', barcode: '', quantity: 0, minQuantity: 5 };

// Avec RNTL 14, `render` est asynchrone : on l'attend (await) avant de chercher un élément.
async function renderForm(onSubmit: (values: ProductFormValues) => Promise<void> = jest.fn()) {
  await render(<ProductForm title="Nouveau produit" defaultValues={emptyValues} onSubmit={onSubmit} onCancel={jest.fn()} />);
}

describe('ProductForm', () => {
  it("affiche les erreurs et n'enregistre pas un formulaire vide", async () => {
    // `userEvent` simule un vrai doigt (appui, focus, frappe touche par touche) et il est asynchrone.
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    await renderForm(onSubmit);

    // Un utilisateur voit un bouton « Enregistrer » : on le cherche par son rôle et son nom.
    await user.press(screen.getByRole('button', { name: 'Enregistrer' }));

    // La validation de React Hook Form est asynchrone : `findBy…` attend l'affichage du texte.
    // Ici `await user.press` suffit souvent, mais `findBy…` est la requête sûre quand on ne
    // sait pas si l'affichage est terminé : le test ne dépend pas de ce détail.
    expect(await screen.findByText('Le nom doit contenir au moins 2 caractères.')).toBeOnTheScreen();
    expect(screen.getByText('La marque est obligatoire.')).toBeOnTheScreen();
    expect(screen.getByText('Le code-barres doit contenir 13 chiffres.')).toBeOnTheScreen();
    expect(screen.getByText('Choisissez une catégorie.')).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('refuse un code-barres dont la clé de contrôle est fausse', async () => {
    const user = userEvent.setup();
    await renderForm();

    // 3017620422004 : 13 chiffres, mais le dernier ne correspond pas à la clé de contrôle EAN-13.
    // On cherche le champ par son libellé : c'est ce que lit un lecteur d'écran.
    await user.type(screen.getByLabelText('Code-barres'), '3017620422004');
    await user.press(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(await screen.findByText("Ce code-barres n'est pas un EAN-13 valide (clé de contrôle).")).toBeOnTheScreen();
  });

  it('ne garde que les chiffres du code-barres saisi', async () => {
    const user = userEvent.setup();
    await renderForm();

    // Espaces et tirets sont ignorés : seuls les chiffres sont conservés.
    await user.type(screen.getByLabelText('Code-barres'), '3 0176-20 422003');

    expect(screen.getByLabelText('Code-barres')).toHaveDisplayValue('3017620422003');
  });

  it('enregistre un produit valide avec des valeurs typées', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    await renderForm(onSubmit);

    await user.type(screen.getByLabelText('Nom du produit'), 'Eau gazeuse 1 L');
    await user.type(screen.getByLabelText('Marque'), 'Badoit');
    await user.type(screen.getByLabelText('Code-barres'), '3017620422003');
    await user.press(screen.getByRole('button', { name: 'Boissons' }));
    await user.press(screen.getByLabelText('Augmenter : Quantité'));
    await user.press(screen.getByLabelText('Augmenter : Quantité'));
    await user.press(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    // Quantité = 2 (un nombre, pas la chaîne « 2 ») et catégorie technique « boissons »
    // (et non le libellé affiché « Boissons »).
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Eau gazeuse 1 L',
      brand: 'Badoit',
      barcode: '3017620422003',
      category: 'boissons',
      quantity: 2,
      minQuantity: 5,
    });
  });
});

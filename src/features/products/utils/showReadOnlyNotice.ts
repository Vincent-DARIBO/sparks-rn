import { Alert } from 'react-native';

// Les produits viennent du serveur, mais l'app ne sait pas encore lui ENVOYER de modification.
// Plutôt que de changer l'affichage sans rien enregistrer, on le dit franchement.
export function showReadOnlyNotice() {
  Alert.alert('Lecture seule', "L'enregistrement sur le serveur n'est pas encore disponible : rien n'a été modifié.");
}

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    // Erreurs Axios
    if (isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      
      // Erreur avec message personnalisé de l'API
      if (apiError?.message) {
        toast.error(apiError.message);
        return;
      }

      // Erreurs de validation
      if (apiError?.errors) {
        Object.values(apiError.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
        return;
      }

      // Erreurs HTTP standard
      switch (error.response?.status) {
        case 400:
          toast.error('Requête invalide');
          break;
        case 401:
          toast.error('Session expirée. Veuillez vous reconnecter.');
          // Rediriger vers la page de connexion si nécessaire
          break;
        case 403:
          toast.error('Accès refusé');
          break;
        case 404:
          toast.error('Ressource non trouvée');
          break;
        case 422:
          toast.error('Données invalides');
          break;
        case 429:
          toast.error('Trop de requêtes. Veuillez réessayer plus tard.');
          break;
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        default:
          toast.error('Une erreur est survenue');
      }
      return;
    }

    // Erreurs de validation Yup
    if (error.name === 'ValidationError') {
      toast.error(error.message);
      return;
    }

    // Autres erreurs JavaScript
    toast.error(error.message);
    return;
  }

  // Erreurs inconnues
  toast.error('Une erreur inattendue est survenue');
};

// Type guard pour les erreurs Axios
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Hook personnalisé pour la gestion des erreurs de formulaire
export const useFormError = () => {
  return {
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.name === 'ValidationError') {
          return error.message;
        }
        return 'Une erreur est survenue';
      }
      return 'Une erreur inattendue est survenue';
    }
  };
};

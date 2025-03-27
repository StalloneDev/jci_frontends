import * as yup from 'yup';

// Schéma de validation pour les rapports
export const reportSchema = yup.object().shape({
  title: yup
    .string()
    .required('Le titre est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  description: yup
    .string()
    .required('La description est requise')
    .min(10, 'La description doit contenir au moins 10 caractères'),
  type: yup
    .string()
    .required('Le type est requis')
    .oneOf(
      ['ACTIVITY', 'MEETING', 'TRAINING', 'FINANCIAL'],
      'Type de rapport invalide'
    ),
  content: yup
    .string()
    .required('Le contenu est requis')
    .min(50, 'Le contenu doit contenir au moins 50 caractères'),
  attachments: yup
    .array()
    .of(
      yup.mixed().test('fileSize', 'Le fichier est trop volumineux', (value) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB
      })
    )
    .nullable(),
});

// Schéma de validation pour les exports
export const exportSchema = yup.object().shape({
  type: yup
    .string()
    .required('Le type est requis')
    .oneOf(
      ['MEMBERS', 'TRAININGS', 'COMMISSIONS', 'MEETINGS'],
      'Type d\'export invalide'
    ),
  format: yup
    .string()
    .required('Le format est requis')
    .oneOf(['CSV', 'EXCEL', 'PDF'], 'Format invalide'),
  filters: yup.object().nullable(),
});

// Schéma de validation pour l'authentification
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Email invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Schéma de validation pour l'inscription
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères'),
  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Email invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
});

// Schéma de validation pour le changement de mot de passe
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Le mot de passe actuel est requis'),
  newPassword: yup
    .string()
    .required('Le nouveau mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    )
    .notOneOf(
      [yup.ref('currentPassword')],
      'Le nouveau mot de passe doit être différent de l\'ancien'
    ),
  confirmNewPassword: yup
    .string()
    .required('La confirmation du nouveau mot de passe est requise')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas'),
});

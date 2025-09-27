module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation uniquement
        'style',    // Changements qui n'affectent pas le sens du code (espace, formatage, etc.)
        'refactor', // Changement qui n'ajoute ni ne corrige de fonctionnalité
        'perf',     // Amélioration des performances
        'test',     // Ajout ou modification de tests
        'chore',    // Tâches de maintenance
        'revert',   // Revert un commit
        'ci',       // Configuration CI/CD
        'build'     // Changements qui affectent le système de build ou les dépendances
      ]
    ],
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'pascal-case', 'lower-case']],
    'subject-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100]
  }
};

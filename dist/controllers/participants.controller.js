"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isErrorWithMessage(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string');
}
exports.default = {
    async create(req, res) {
        try {
            // Implémentation à compléter
            res.status(201).json({ message: 'Participant créé avec succès' });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error) ? error.message : 'Une erreur inconnue est survenue';
            res.status(400).json({ message: errorMessage });
        }
    },
    async findAll(_req, res) {
        try {
            // Implémentation à compléter
            res.json([]);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },
    async findOne(req, res) {
        try {
            // Implémentation à compléter
            res.json({ id: req.params.id });
        }
        catch (error) {
            res.status(404).json({ message: 'Participant non trouvé' });
        }
    },
    async update(req, res) {
        try {
            // Implémentation à compléter
            res.json({ id: req.params.id, ...req.body });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error) ? error.message : 'Une erreur inconnue est survenue';
            res.status(400).json({ message: errorMessage });
        }
    },
    async delete(_req, res) {
        try {
            // Implémentation à compléter
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression' });
        }
    }
};
//# sourceMappingURL=participants.controller.js.map
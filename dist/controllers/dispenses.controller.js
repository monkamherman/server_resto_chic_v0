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
            res.status(201).json({ message: 'Dispense créée avec succès' });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Une erreur est survenue lors de la création de la dispense';
            res.status(400).json({ message: errorMessage });
        }
    },
    async findAll(_req, res) {
        try {
            // Implémentation à compléter
            res.json([]);
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la récupération des dispenses';
            res.status(500).json({ message: errorMessage });
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            // Implémentation à compléter
            res.json({ id });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Dispense non trouvée';
            res.status(404).json({ message: errorMessage });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            // Implémentation à compléter
            res.json({ id, ...req.body });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la mise à jour de la dispense';
            res.status(400).json({ message: errorMessage });
        }
    },
    async delete(req, res) {
        try {
            // Implémentation à compléter
            res.status(204).send();
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la suppression de la dispense';
            res.status(500).json({ message: errorMessage });
        }
    }
};
//# sourceMappingURL=dispenses.controller.js.map
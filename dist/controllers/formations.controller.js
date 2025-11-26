"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async create(req, res) {
        try {
            // Implémentation à compléter
            res.status(201).json({ message: 'Formation créée avec succès' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    async findAll(req, res) {
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
            const { id } = req.params;
            // Implémentation à compléter
            res.json({ id });
        }
        catch (error) {
            res.status(404).json({ message: 'Formation non trouvée' });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            // Implémentation à compléter
            res.json({ id, ...req.body });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            // Implémentation à compléter
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression' });
        }
    }
};
//# sourceMappingURL=formations.controller.js.map
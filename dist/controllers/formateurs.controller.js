"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formateur_service_1 = require("../application/use-cases/formateurs/formateur.service");
// Pour l'instant, nous allons créer une implémentation factice du repository
// Dans une application réelle, cela serait injecté via le système d'injection de dépendances
class MockFormateurRepository {
    formateurs = [];
    async create(createFormateurDto) {
        const formateur = {
            id: Math.random().toString(36).substring(2, 9),
            ...createFormateurDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.formateurs.push(formateur);
        return formateur;
    }
    async findAll(page, limit, search) {
        // Implémentation simplifiée pour l'exemple
        let filteredFormateurs = this.formateurs;
        // Filtrer par recherche si un terme est fourni
        if (search) {
            const searchLower = search.toLowerCase();
            filteredFormateurs = this.formateurs.filter(formateur => formateur.prenom.toLowerCase().includes(searchLower) ||
                formateur.nom.toLowerCase().includes(searchLower) ||
                formateur.email.toLowerCase().includes(searchLower));
        }
        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = filteredFormateurs.slice(start, end);
        return {
            data,
            total: filteredFormateurs.length
        };
    }
    async findOne(id) {
        return this.formateurs.find(f => f.id === id) || null;
    }
    async update(id, updateFormateurDto) {
        const index = this.formateurs.findIndex(f => f.id === id);
        if (index === -1) {
            throw new Error('Formateur non trouvé');
        }
        this.formateurs[index] = { ...this.formateurs[index], ...updateFormateurDto, updatedAt: new Date() };
        return this.formateurs[index];
    }
    async remove(id) {
        this.formateurs = this.formateurs.filter(f => f.id !== id);
    }
    async exists(email, excludeId) {
        return this.formateurs.some(f => f.email === email && f.id !== excludeId);
    }
    async findBySpecialite(specialite) {
        return this.formateurs.filter(formateur => formateur.specialites.some(s => s.toLowerCase().includes(specialite.toLowerCase())));
    }
    async findByDisponibilite(disponibilite) {
        return this.formateurs.filter(formateur => formateur.disponibilites.some(dispo => dispo.toLowerCase().includes(disponibilite.toLowerCase())));
    }
}
// Initialisation du service avec le repository factice
const formateurService = new formateur_service_1.FormateurService(new MockFormateurRepository());
function isErrorWithMessage(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string');
}
exports.default = {
    async create(req, res) {
        try {
            const createFormateurDto = req.body;
            const formateur = await formateurService.create(createFormateurDto);
            res.status(201).json({
                success: true,
                message: 'Formateur créé avec succès',
                data: formateur
            });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Une erreur est survenue lors de la création du formateur';
            const statusCode = isErrorWithMessage(error) && (error.statusCode || error.status)
                ? error.statusCode || error.status
                : 500;
            res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    },
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await formateurService.findAll(page, limit, search);
            res.json({
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit)
                }
            });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la récupération des formateurs';
            const statusCode = isErrorWithMessage(error) && error.statusCode
                ? error.statusCode
                : 500;
            res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID du formateur manquant'
                });
            }
            const formateur = await formateurService.findOne(id);
            if (!formateur) {
                return res.status(404).json({
                    success: false,
                    message: 'Formateur non trouvé'
                });
            }
            res.json({
                success: true,
                data: formateur
            });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la récupération du formateur';
            const statusCode = isErrorWithMessage(error) && error.statusCode
                ? error.statusCode
                : 500;
            res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID du formateur manquant'
                });
            }
            const updateFormateurDto = req.body;
            const updatedFormateur = await formateurService.update(id, updateFormateurDto);
            res.json({
                success: true,
                message: 'Formateur mis à jour avec succès',
                data: updatedFormateur
            });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la mise à jour du formateur';
            const statusCode = isErrorWithMessage(error) && error.statusCode
                ? error.statusCode
                : 500;
            res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID du formateur manquant'
                });
            }
            await formateurService.remove(id);
            res.status(204).send();
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la suppression du formateur';
            const statusCode = isErrorWithMessage(error) && error.statusCode
                ? error.statusCode
                : 500;
            res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
};
//# sourceMappingURL=formateurs.controller.js.map
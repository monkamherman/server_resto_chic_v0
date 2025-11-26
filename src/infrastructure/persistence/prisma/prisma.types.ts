export interface FormateurPrismaModel {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  specialites: string[];
  disponibilites: string[];
  statut: string;
  created_at: Date;
  updated_at: Date;
}

export type FormateurCreateInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  specialites: string[];
  disponibilites: string[];
  statut?: string;
};

export type FormateurUpdateInput = {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string | null;
  specialites?: { set?: string[]; push?: string[] };
  disponibilites?: { set?: string[]; push?: string[] };
  statut?: string;
};

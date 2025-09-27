import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    try {
      // Vérifie si la valeur est un ObjectId valide
      if (!ObjectId.isValid(value)) {
        throw new Error("ID invalide");
      }

      // Crée un nouvel ObjectId pour s'assurer que le format est correct
      new ObjectId(value);

      return value;
    } catch (error) {
      throw new BadRequestException("ID invalide");
    }
  }
}

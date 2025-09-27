import { Module } from "@nestjs/common";
import { ParseObjectIdPipe } from "./parse-object-id.pipe";

@Module({
  providers: [ParseObjectIdPipe],
  exports: [ParseObjectIdPipe],
})
export class PipesModule {}

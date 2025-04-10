import path from "path"

import IRes from "../../contracts/IRes";

import { PPTXTemplateFile } from "../../modules/pptx/PPTXTemplateFile";
import { PPTXTemplateHandler } from "../../modules/pptx/PPTXTemplateHandler";
import { TemplateHandler } from "../../contracts/TemplateHandler";
import { TemplateFile } from "../../contracts/TemplateFile";

export type TTemplateHandlerBuilder = {
  filePath: string
}

export class TemplateHandlerBuilder {
  static new({ filePath }: TTemplateHandlerBuilder): IRes<TemplateHandler<TemplateFile>> {
    const fileName = filePath.split("/").pop();

    try {
      if (fileName) {
        const fileType = path.extname(fileName).toLowerCase();

        if (fileType == ".pptx") {
          const templateFile = new PPTXTemplateFile({
            filePath
          });
          const templateHandler = new PPTXTemplateHandler({
            templateFile
          });

          return [templateHandler, null];
        }

        throw new Error("file type not supported");
      } else {
        throw new Error("file name not found");
      }
    } catch (error) {
      return [null, error];
    }
  }
}

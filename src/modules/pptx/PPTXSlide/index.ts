import { TPopulateData } from "../../../contracts/TemplateHandler";

import IPromiseRes from "../../../contracts/IPromiseRes";

import { ErrorPlaceholderNotLoadded } from "../../error/ErrorPlaceholderNotLoadded";
import { ErrorCantGetFileXML } from "../../error/ErrorCantGetFileXML";

import { PPTXTemplateFile } from "../PPTXTemplateFile";
import { PPTXPlaceholderBuilder } from "../PPTXPlaceholderBuilder";
import { Placeholder, TPlaceholderContructor } from "../../../contracts/Placeholder";
import { PPTXLoopPlaceholder } from "../PPTXLoopPlaceholder";

type TConstructor = {
  number: number,
  templateFile: PPTXTemplateFile
}

export class PPTXSlide {
  private templateFile: PPTXTemplateFile;
  private number: number;
  private xmlDocument: Document | null = null;
  private placeholders: Placeholder[] = [];

  constructor({ number, templateFile }: TConstructor) {
    this.number = number;
    this.templateFile = templateFile;
  }

  public getFilePath() {
    return `ppt/slides/slide${this.number}.xml`;
  }

  public getNumber() {
    return this.number;
  }

  public async getXMLDocument(): IPromiseRes<Document> {
    if (!this.xmlDocument) {
      const [xml, error] = await this.templateFile.getFileXML({
        filePath: this.getFilePath()
      });

      if (error) {
        return [null, error];
      }

      this.xmlDocument = xml;
    }

    if (!this.xmlDocument) {
      return [null, null];
    }

    return [this.xmlDocument.cloneNode(true) as Document, null];
  }

  public setXMLDocument(xmlDocument: Document): void {
    this.xmlDocument = xmlDocument;
  }

  public async getPlaceholders(): IPromiseRes<Placeholder[]> {
    const [_, errorLoadPlaceholders] = await this.loadPlaceholders();

    if (errorLoadPlaceholders) {
      return [null, errorLoadPlaceholders];
    }

    return [this.placeholders, null];
  }

  public async loadPlaceholders(): IPromiseRes<Placeholder[]> {
    const [xmlDocument, error] = await this.getXMLDocument();
    const placeholders: Placeholder[] = [];
    const openPlaceholders: PPTXLoopPlaceholder[] = [];

    if (error) {
      return [null, error];
    }

    if (!xmlDocument) {
      return [null, new ErrorCantGetFileXML({ file: this.getFilePath() })];
    }

    const stack = [...Array.from(xmlDocument.getElementsByTagName("a:p"))];

    for (const node of stack) {
      const nodeText = node.textContent;

      if (nodeText && nodeText.trim().length > 0) {
        const fullMatchRegex = /{.*?}/g;

        if (nodeText.match(fullMatchRegex)) {
          const matchs = nodeText.matchAll(fullMatchRegex);

          for (const match of matchs) {
            const placeholderConstructorData: TPlaceholderContructor = {
              key: match[0],
              parent: null,
              node,
            };

            if (openPlaceholders.length > 0) {
              placeholderConstructorData.parent = openPlaceholders.slice(-1)[0];
            }

            const placeholder = PPTXPlaceholderBuilder.new(placeholderConstructorData);

            const isOppeningPlaceholder =
              placeholder instanceof PPTXLoopPlaceholder;

            if (!placeholder) {
              if (openPlaceholders.length == 1) {
                const openPlaceholder = openPlaceholders.pop();

                if (openPlaceholder) {
                  openPlaceholder.setCloseNode(node);

                  placeholders.push(openPlaceholder);
                }
              }

              if (openPlaceholders.length > 1) {
                const openPlaceholder = openPlaceholders.pop();

                if (openPlaceholder) {
                  openPlaceholder.setCloseNode(node);
                }
              }

              continue;
            }

            if (openPlaceholders.length == 0 && !isOppeningPlaceholder) {
              placeholders.push(placeholder);

              continue;
            }

            if (openPlaceholders.length == 0 && isOppeningPlaceholder) {
              openPlaceholders.push(placeholder);

              continue;
            }

            if (openPlaceholders.length > 0 && !isOppeningPlaceholder) {
              const parent = openPlaceholders.slice(-1)[0];

              parent.appendChild(placeholder);

              continue;
            }

            if (openPlaceholders.length > 0 && isOppeningPlaceholder) {
              const parent = openPlaceholders.slice(-1)[0];

              parent.appendChild(placeholder);

              openPlaceholders.push(placeholder);

              continue;
            }
          }
        }
      }
    }

    this.placeholders = placeholders;

    return [this.placeholders, null];
  }

  public async populate(data: TPopulateData) {
    const [placeholders, error] = await this.loadPlaceholders();

    if (error) {
      return [null, error];
    }

    if (!placeholders) {
      return [null, new ErrorPlaceholderNotLoadded()];
    }

    for (const key of Object.keys(data)) {
      const placeholder = placeholders
        .find((placeholder) => {
          return placeholder.getKey().match(key);
        });

      if (!placeholder) {
        continue;
      }

      placeholder.populate(data[key]);
      const [_result, error] = await this.save();

      if (error) {
        return [null, error];
      }
    }

    return [true, null];
  }

  public async save() {
    const [content, error] = await this.getXMLDocument();

    if (error) {
      return [null, error];
    }

    if (content) {
      this.templateFile.writeXML({
        filePath: this.getFilePath(),
        content: content
      });
    }

    return [true, null];
  }
}

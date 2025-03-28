import { join } from "path";

import { PPTXTemplateFile } from "../PPTXTemplateFile";

import { PPTXTemplateHandler } from ".";
import { existsSync } from "fs";

describe("Template File PPTX", () => {
  const templatePath = join(__dirname, "..", "..", "..", "..", "assets", "template.pptx");

  it("should save file", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: templatePath
    });
    const templateHandler = new PPTXTemplateHandler({
      templateFile
    });
    const outputPath = join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx")
    const [result, error] = await templateHandler.save({
      filePath: outputPath,
      data: {
        title: "Custom title",
      }
    });

    expect(result).toBe(true);
    expect(error).toBe(null);
    expect(existsSync(outputPath)).toBe(true);
  });

  it("should save file if 'data' don't match any placeholder", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: templatePath
    });
    const templateHandler = new PPTXTemplateHandler({
      templateFile
    });
    const outputPath = join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx")
    const [result, error] = await templateHandler.save({
      filePath: outputPath,
      data: {
        title_title: "Custom title",
        name_name: "Custom Name"
      }
    });

    expect(result).toBe(true);
    expect(error).toBe(null);
    expect(existsSync(outputPath)).toBe(true);
  });

  it("should return a error if template file not exists", async () => {
    const templateFile = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });
    const templateHandler = new PPTXTemplateHandler({
      templateFile
    });

    const [result, error] = await templateHandler.save({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx"),
      data: {
        title: "Custom title",
        name: "Custom Name"
      }
    });

    expect(result).toBe(null);
    expect(error).toBeTruthy();
  });
});


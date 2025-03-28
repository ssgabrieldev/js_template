import { join } from "path";

import { PPTXTemplateFile } from ".";
import { existsSync } from "fs";

describe("Template File PPTX", () => {
  const templatePath = join(__dirname, "..", "..", "..", "..", "assets", "template.pptx");

  it("should return a error when template not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: "foo.pptx"
    });
    const [result, error] = await Object(templateFilePPTX).loadFile();
  
    expect(result).toBe(null);
    expect(error).toBeTruthy();
  });
  
  it("should return true if template is loadded", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });
    const [result, error] = await Object(templateFilePPTX).loadFile();
  
    expect(result).toBe(true);
    expect(error).toBe(null);
  });

  it("should return a error if filePath not found", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide10000.xml"
    });

    expect(docXML).toBe(null);
    expect(error).toBeTruthy();
  });

  it("should return file XML", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });

    const [docXML, error] = await templateFilePPTX.getFileXML({
      filePath: "ppt/slides/slide1.xml"
    });

    expect(docXML).toBeTruthy();
    expect(error).toBe(null);
  });

  it("should return files", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const [files, error] = await templateFilePPTX.getFiles();

    expect(files).toBeTruthy();
    expect(error).toBe(null);
  });

  it ("should save file", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: templatePath
    });

    const outPath = join(__dirname, "..", "..", "..", "..", "assets", "temp", "template.pptx");
    const [result, error] = await templateFilePPTX.save({
      filePath: outPath
    });

    expect(result).toBe(true);
    expect(error).toBeNull();
    expect(existsSync(outPath)).toBe(true);
  });
});

import { join } from "path";

import { PPTXTemplateFile } from "../PPTXTemplateFile";

import { PPTXSlide } from ".";


describe("Slide", () => {
  it("should populate works", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });

    const data: any = {
      title: "bar",
      name: "teste"
    }

    await slide.populate(data);

    const [placeholders, _] = await slide.getPlaceholders();

    if (placeholders) {
      placeholders.forEach((placeholder) => {
        let placeholderKey = placeholder.getKey();
        expect(placeholder.getNode().textContent).toBe(data[placeholderKey])
      })
    }
  });

  it("should identify all placeholders", async () => {
    const templateFilePPTX = new PPTXTemplateFile({
      filePath: join(__dirname, "..", "..", "..", "..", "assets", "template.pptx")
    });
    const slide = new PPTXSlide({
      number: 1,
      templateFile: templateFilePPTX
    });

    const placeholdersKeys = [
      "{title}",
      "{name}"
    ];
    const [placeholders, _] = await slide.getPlaceholders();

    if (placeholders) {
      placeholders.forEach((placeholder) => {
        expect(placeholdersKeys.includes(placeholder.getKeyWithTags())).toBe(true);
      });
    }
  });
});

import {TemplateHandlerBuilder} from ".";
import { PPTXTemplateHandler } from "../../modules/pptx/PPTXTemplateHandler";

describe("TemplateHandlerBuild", () => {
  it("should return PPTXTemplateHandler", () => {
    const [templateHandler, error] = TemplateHandlerBuilder.new({
      filePath: "path/template.pptx"
    });

    expect(error).toBe(null);
    expect(templateHandler).toBeInstanceOf(PPTXTemplateHandler);
  });
  it("should throw error if filetype not supported", () => {
    const [_, error] = TemplateHandlerBuilder.new({
      filePath: "path/template.asdf"
    });

    expect(error).toBeTruthy();
  });
});

import { PPTXTextPlaceholder } from "../PPTXTextPlaceholder";
import { PPTXPlaceholderBuilder } from ".";
import { PPTXLoopPlaceholder } from "../PPTXLoopPlaceholder";

describe("PPTXPlaceholder", () => {
  it("should return PPTXTextPlaceholder instance", () => {
    const placeholder = PPTXPlaceholderBuilder.new({
      key: "{foo}",
      node: {
        cloneNode: () => {}
      } as Element,
      parent: null
    });

    expect(placeholder).toBeInstanceOf(PPTXTextPlaceholder);
  });

  it("should return PPTXLoopPlaceholder instance", () => {
    const placeholder = PPTXPlaceholderBuilder.new({
      key: "{#foo}",
      node: {
        cloneNode: () => {}
      } as Element,
      parent: null
    });

    expect(placeholder).toBeInstanceOf(PPTXLoopPlaceholder);
  });

  it("should return false to close tag", () => {
    const placeholder = PPTXPlaceholderBuilder.new({
      key: "{/foo}",
      node: {} as Element,
      parent: null
    });

    expect(placeholder).toBe(false);
  });
});


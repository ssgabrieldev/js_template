import { PPTXTextPlaceholder } from ".";

describe("PPTXPlaceholder", () => {
  it("should getKey return key", () => {
    const key = "foo";
    const node = { textContent: key } as Node;
    const pptxPlaceholder = new PPTXTextPlaceholder({ key, node });

    expect(pptxPlaceholder.getKey()).toBe(key);
  });

  it("should populate replace placeholder", () => {
    const value = "test";
    const key = "fooo";
    const node = { textContent: `{${key}}` } as Node;
    const pptxPlaceholder = new PPTXTextPlaceholder({ key, node });

    pptxPlaceholder.populate(value);
    expect(node.textContent).toBe(value);
  });
});

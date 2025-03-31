import { DOMParser, XMLSerializer } from "xmldom";
import { PPTXLoopPlaceholder } from ".";
import { PPTXTextPlaceholder } from "../PPTXTextPlaceholder";

describe("PPTXPlaceholder", () => {
  const serializer = new XMLSerializer();
  const parser = new DOMParser();

  it("should clone children correctly with one level of depth", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>item1</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>item2</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{item}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const openItemsNode = parentNode.getElementsByTagName("a:p")[0];
    const itemNode = parentNode.getElementsByTagName("a:p")[1];
    const closeItemsNode = parentNode.getElementsByTagName("a:p")[2];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: openItemsNode
    });
    const itemPlaceholder = new PPTXTextPlaceholder({
      key: "item",
      parent: itemsPlaceholder,
      node: itemNode
    });

    itemsPlaceholder.setCloseNode(closeItemsNode);
    itemsPlaceholder.appendChild(itemPlaceholder);

    const data = [
      "item1",
      "item2"
    ];

    itemsPlaceholder.populate(data);

    const itemsNodeXMLString = serializer.serializeToString(parentNode);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(expectedOutputXMLString.replace(/\s+/g, ""))
      .toBe(itemsNodeXMLString.replace(/\s+/g, ""));
  });

  it("should clone children correctly with two levels of depth", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name1</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name2</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name3</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name4</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{name}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const itemsOpenNode = parentNode.getElementsByTagName("a:p")[0];
    const namesOpenNode = parentNode.getElementsByTagName("a:p")[1];
    const lorenNode = parentNode.getElementsByTagName("a:p")[2];
    const namesCloseNode = parentNode.getElementsByTagName("a:p")[3];
    const itemsCloseNode = parentNode.getElementsByTagName("a:p")[4];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: itemsOpenNode
    });
    const namesPlaceholder = new PPTXLoopPlaceholder({
      key: "names",
      parent: itemsPlaceholder,
      node: namesOpenNode
    });
    const lorenPlaceholder = new PPTXTextPlaceholder({
      key: "name",
      parent: namesPlaceholder,
      node: lorenNode
    });

    itemsPlaceholder.setCloseNode(itemsCloseNode);
    itemsPlaceholder.appendChild(namesPlaceholder);

    namesPlaceholder.setCloseNode(namesCloseNode);
    namesPlaceholder.appendChild(lorenPlaceholder);

    const data = [
      [
        "name1",
        "name2"
      ],
      [
        "name3",
        "name4"
      ]
    ];

    itemsPlaceholder.populate(data);

    const parentNodeXMLString = serializer.serializeToString(parentNode);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(expectedOutputXMLString.replace(/\s+/g, ""))
      .toBe(parentNodeXMLString.replace(/\s+/g, ""));
  });

  it("should clone children correctly with three levels of depth", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>people1</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>people2</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>people3</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>people4</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{person}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/people}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const itemsOpenNode = parentNode.getElementsByTagName("a:p")[0];
    const namesOpenNode = parentNode.getElementsByTagName("a:p")[1];
    const peopleOpenNode = parentNode.getElementsByTagName("a:p")[2];
    const personNode = parentNode.getElementsByTagName("a:p")[3];
    const peopleCloseNode = parentNode.getElementsByTagName("a:p")[4];
    const namesCloseNode = parentNode.getElementsByTagName("a:p")[5];
    const itemsCloseNode = parentNode.getElementsByTagName("a:p")[6];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: itemsOpenNode
    });
    const namesPlaceholder = new PPTXLoopPlaceholder({
      key: "names",
      parent: itemsPlaceholder,
      node: namesOpenNode
    });
    const peoplePlaceholder = new PPTXLoopPlaceholder({
      key: "people",
      parent: namesPlaceholder,
      node: peopleOpenNode
    });
    const personPlaceholder = new PPTXTextPlaceholder({
      key: "person",
      parent: peoplePlaceholder,
      node: personNode
    });

    itemsPlaceholder.setCloseNode(itemsCloseNode);
    itemsPlaceholder.appendChild(namesPlaceholder);

    namesPlaceholder.setCloseNode(namesCloseNode);
    namesPlaceholder.appendChild(peoplePlaceholder);

    peoplePlaceholder.setCloseNode(peopleCloseNode);
    peoplePlaceholder.appendChild(personPlaceholder);

    const data = [
      [
        [
          "people1",
          "people2"
        ]
      ],
      [
        [
          "people3",
          "people4"
        ]
      ]
    ];

    itemsPlaceholder.populate(data);

    const parentNodeXMLString = serializer.serializeToString(parentNode);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(parentNodeXMLString.replace(/\s+/g, ""))
      .toBe(expectedOutputXMLString.replace(/\s+/g, ""));
  });

  it("should clone random text node", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>random text</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>random text</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>random text</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const itemsOpenNode = parentNode.getElementsByTagName("a:p")[0];
    const randomTextNode = parentNode.getElementsByTagName("a:p")[1];
    const itemsCloseNode = parentNode.getElementsByTagName("a:p")[2];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: itemsOpenNode
    });
    const randomTextPlaceholder = new PPTXTextPlaceholder({
      key: "",
      parent: itemsPlaceholder,
      node: randomTextNode
    });

    itemsPlaceholder.setCloseNode(itemsCloseNode);
    itemsPlaceholder.appendChild(randomTextPlaceholder);

    const data = [
      "people1",
      "people2"
    ];

    itemsPlaceholder.populate(data);

    const parentNodeXMLString = serializer.serializeToString(parentNode);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(parentNodeXMLString.replace(/\s+/g, ""))
      .toBe(expectedOutputXMLString.replace(/\s+/g, ""));
  });

  it("should clone children when loop starts and ends on the same line", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}item1,item2,{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}{item},{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const textElements = parentNode.getElementsByTagName("a:p");
    const itemsOpenNode = textElements[0];
    const randomTextNode = textElements[0];
    const itemsCloseNode = textElements[0];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: itemsOpenNode
    });
    const randomTextPlaceholder = new PPTXTextPlaceholder({
      key: "",
      parent: itemsPlaceholder,
      node: randomTextNode
    });

    itemsPlaceholder.setCloseNode(itemsCloseNode);
    itemsPlaceholder.appendChild(randomTextPlaceholder);

    const data = [
      "people1",
      "people2"
    ];

    itemsPlaceholder.populate(data);

    const parentNodeXMLString = serializer.serializeToString(parentNode);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(parentNodeXMLString.replace(/\s+/g, ""))
      .toBe(expectedOutputXMLString.replace(/\s+/g, ""));
  });
});

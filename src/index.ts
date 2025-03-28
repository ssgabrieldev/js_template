import { join } from "path";

import { PPTXTemplateHandler } from "./modules/pptx/PPTXTemplateHandler";
import { PPTXTemplateFile } from "./modules/pptx/PPTXTemplateFile";
import { UtilsString } from "./modules/utils/string";

const templateFile = new PPTXTemplateFile({
  filePath: join(__dirname, "../assets/template.pptx")
});
const templateHandler = new PPTXTemplateHandler({
  templateFile
});

async function main() {
  const [_, error] = await templateHandler.save({
    filePath: join(__dirname, "../assets/temp/template.pptx"),
    data: {
      title: "Teste",
      name: "Paulo Gabriel Santana Silva",
      modules: [
        ["module1",
        "module2"],
        ["module3",
        "module4",
        "module5"]
      ]
    }
  })

  if (error) {
    console.error(error)
  }
}

main();

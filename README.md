# js-template
Biblioteca de templates

# Funcionalidades

## Iniciar Um Template
```js
const [templateHandler, error] = TemplateHandlerBuilder.new({
    filePath: "path/to/template/file.pptx"
});
```

## Placeholder Básico
```
Meu título: {title}
```

```js
const [result, error] = await templateHandler.save({
    filePath: "path/to/final/file.pptx",
    data: {
        title: "Título"
    }
});
```

## Placeholder Loop
```
Produtos:
{#products}
{product}
{/products}
```

```js
const [result, error] = await templateHandler.save({
    filePath: "path/to/final/file.pptx",
    data: {
        products: ["Laranja", "Maçã", "Uva"]
    }
});
```

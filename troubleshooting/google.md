# Erros comuns no Google Chrome

## Prompt API for Gemini Nano (Web AI)

### LanguageModel.params

Erro:

```
LanguageModel.params is not a function
```

Os exemplos [exemplo-03-webai01](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-03-webai01), [exemplo-04-webai02-temperature-and-topK](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-04-webai02-temperature-and-topK) e [exemplo-05-webai03-multimodal](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-05-webai03-multimodal) usam o método `LanguageModel.params()`, que foi [**descontinuado pela **Google** e desabilitado em novas instalações**](https://developer.chrome.com/origintrials/#/view_trial/4469259680211795969), continuando disponível para usários com a instalação antiga até 5 de outubro de 2026.

Para corrigir, basta usar as configurações que já vêm por padrão ou personalizar manualmente, por exemplo:

De:

```js
const params = await LanguageModel.params();
console.log('Language Model Params:', params);

const temperature = params.defaultTemperature;
const topK = params.defaultTopK;

const initialPrompts = [
  {
    role: 'system',
    content: `Você é um assistente de IA que responde de forma clara e objetiva.`,
  },
];

const question = 'Quem inventou o JavaScript?';
output.innerHTML = 'Gerando resposta...';

const session = await LanguageModel.create({
  expectedInputLanguages: ['pt'],
  temperature,
  topK,
  initialPrompts,
});
```

Para:

```js
const initialPrompts = [
  {
    role: 'system',
    content: `Você é um assistente de IA que responde de forma clara e objetiva.`,
  },
];

const question = 'Quem inventou o JavaScript?';
output.innerHTML = 'Gerando resposta...';

const session = await LanguageModel.create({
  expectedInputLanguages: ['pt'],
  initialPrompts,
});
```

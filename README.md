# Jogo dos 4 Dígitos - PWA

Um jogo de adivinhação de números com 4 dígitos, disponível como Progressive Web App (PWA).

## Configuração do PWA

Para que o PWA funcione corretamente, você precisa:

1. Criar os ícones necessários:
   - Crie uma pasta `icons` no diretório raiz
   - Adicione dois ícones:
     - `icon-192x192.png` (192x192 pixels)
     - `icon-512x512.png` (512x512 pixels)

2. Servir o aplicativo através de HTTPS:
   - O PWA requer uma conexão segura
   - Em desenvolvimento local, você pode usar `localhost`

3. Testar a instalação:
   - Abra o aplicativo em um navegador compatível
   - Você verá um banner de instalação ou um ícone na barra de endereços
   - Clique para instalar o aplicativo em seu dispositivo

## Funcionalidades do PWA

- Instalação na tela inicial
- Funcionamento offline
- Cache de recursos
- Interface nativa
- Atualizações automáticas

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Service Workers
- Cache API
- Web App Manifest

## Desenvolvimento

Para testar localmente:

1. Clone o repositório
2. Sirva os arquivos usando um servidor local (ex: `python -m http.server`)
3. Acesse através de `localhost:8000`

## Compatibilidade

O PWA é compatível com os seguintes navegadores:
- Chrome
- Firefox
- Edge
- Safari (iOS)
- Chrome para Android 
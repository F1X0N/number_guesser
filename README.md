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

## Publicação na Google Play Store

### Pré-requisitos

1. Uma conta de desenvolvedor Google Play (custo único de $25)
2. Node.js instalado
3. Java Development Kit (JDK) instalado
4. Android Studio instalado
5. Um domínio HTTPS para hospedar seu PWA

### Passo a Passo

1. **Hospedar o PWA**:
   - Faça deploy do seu PWA em um domínio HTTPS
   - Atualize o `host` no arquivo `twa-manifest.json` com seu domínio

2. **Instalar o Bubblewrap**:
   ```bash
   npm install -g @bubblewrap/cli
   ```

3. **Gerar o APK**:
   ```bash
   bubblewrap init --manifest https://seu-dominio.com/manifest.json --icon icons/icon-512x512.png
   bubblewrap build
   ```

4. **Preparar a Play Store**:
   - Acesse o [Google Play Console](https://play.google.com/console)
   - Crie um novo aplicativo
   - Preencha as informações básicas:
     - Nome do aplicativo
     - Descrição
     - Categoria
     - Classificação de conteúdo
     - Política de privacidade

5. **Preparar os assets**:
   - Screenshots do aplicativo
   - Ícone de alta resolução
   - Banner promocional
   - Descrição detalhada
   - Política de privacidade

6. **Gerar o Bundle de App**:
   ```bash
   bubblewrap build --generateAppBundle
   ```

7. **Enviar para revisão**:
   - Faça upload do arquivo .aab gerado
   - Preencha o formulário de classificação de conteúdo
   - Envie para revisão

### Requisitos da Play Store

1. **Política de Privacidade**:
   - Crie uma página de política de privacidade
   - Inclua informações sobre coleta de dados
   - Explique como os dados são usados

2. **Classificação de Conteúdo**:
   - Preencha o questionário de classificação
   - Forneça informações sobre conteúdo sensível

3. **Preços e Distribuição**:
   - Defina se o app é gratuito ou pago
   - Selecione os países de distribuição
   - Configure preços (se aplicável)

4. **Conteúdo do App**:
   - Screenshots de qualidade
   - Vídeo promocional (opcional)
   - Descrição clara e atraente

### Tempo de Revisão

- A revisão inicial pode levar alguns dias
- Mantenha-se atento ao e-mail para possíveis solicitações de ajustes
- Após aprovado, o app estará disponível em algumas horas

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
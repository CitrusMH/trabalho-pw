# Sistema de Comentários com Nuxt 3 e Supabase
[clique para acessar](https://trabalho-pw-henna.vercel.app/) 

Este é um sistema de comentários moderno desenvolvido com Nuxt 3 e Supabase, oferecendo uma experiência de usuário fluida e segura.

## 🚀 Funcionalidades

- Autenticação de usuários
- Sistema de perfis de usuário
- Postagem de comentários
- Interface moderna e responsiva
- Design com tema escuro e efeitos de vidro (glassmorphism)

## 🛠️ Tecnologias Utilizadas

- [Nuxt 3](https://nuxt.com/) - Framework Vue.js
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vue 3](https://vuejs.org/) - Framework JavaScript
- [Vue Router](https://router.vuejs.org/) - Roteamento

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- Conta no Supabase
- NPM ou Yarn

## 🔧 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## 🏗️ Estrutura do Projeto

```
├── components/         # Componentes Vue reutilizáveis
├── pages/             # Páginas da aplicação
├── public/            # Arquivos estáticos
├── server/            # API routes e lógica do servidor
├── app.vue            # Componente raiz
└── nuxt.config.ts     # Configuração do Nuxt
```

## 🔐 Autenticação

O sistema utiliza o Supabase Auth para gerenciar a autenticação dos usuários. Os usuários podem:
- Criar uma conta
- Fazer login
- Criar um perfil com nome de usuário
- Fazer logout

## 💬 Sistema de Comentários

- Os usuários podem postar comentários após criar um perfil
- Os comentários são exibidos em tempo real
- Interface intuitiva para criação e visualização de comentários
- Formatação de data e hora no padrão brasileiro

## 🎨 Interface

- Design moderno com tema escuro
- Efeitos de vidro (glassmorphism)
- Interface responsiva
- Feedback visual para ações do usuário
- Mensagens de toast para notificações

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run generate` - Gera uma versão estática do site
- `npm run preview` - Visualiza a versão de produção localmente

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ✨ Agradecimentos

- Equipe do Nuxt.js
- Equipe do Supabase
- Comunidade Vue.js

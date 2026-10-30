# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Konfiguracja środowiska (zmienne .env)

Projekt korzysta ze zmiennych środowiskowych przechowywanych w pliku `.env` (lokalnie, **nie commitowanym** do gita).

- **`.env.example`** – szablona pliku z przykładowymi wartościami, commitowana do repozytorium. Używaj jako punktu startu.
- **`.env`** – lokalny plik z prawdziwymi wartościami (np. `MONGODB_URI`, `DB_NAME`). Jest ignorowany przez git.

Aby uruchomić projekt lokalnie:

1. `npm install`
2. Skopiuj `.env.example` do `.env`:
   ```bash
   cp .env.example .env
   ```
3. Uzupełnij w pliku `.env` prawdziwe dane dostępowe (m.in. `MONGODB_URI` i `DB_NAME`).

Plik `.env` **musi** być dodany do `.gitignore` i nie powinien być nigdy commitowany do repozytorium. Wszystkie dane dostępowe (adres bazy, hasło) powinny znajdować się tylko w tym pliku.

Dodatkowe zmienne w `.env`:
- `JWT_SECRET` – klucz do podpisu tokenów JWT.
- `CORS_ORIGIN` – adres aplikacji frontend (domyślnie `http://localhost:3000`).
- `REACT_APP_API_URL` – adres backendu (domyślnie `http://localhost:4000`).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

In the /src directory, you can run:

### `node server.js`

Starts the backend server using Node.js.

This script is located in the /src directory and is responsible for handling API requests and server-side logic for the application.
Make sure to run npm install beforehand to install all required dependencies.

The server will run on http://localhost:4000 unless configured otherwise.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## Wdrożenie na Netlify (frontend + backend jako Netlify Functions)

Cały projekt działa na Netlify: frontend (Create React App) jako statyczna strona,
a backend (`src/server.js`, Express) jako funkcja serverless `netlify/functions/api.js`.

### Zmienne środowiskowe (Netlify -> Site configuration -> Environment variables)

| Zmienna | Wartość |
| --- | --- |
| `REACT_APP_API_URL` | `<api_url>` |
| `MONGODB_URI` | connection string z MongoDB Atlas |
| `DB_NAME` | `<dbName>` |
| `JWT_SECRET` | długi, losowy sekret |
| `CORS_ORIGIN` | `https://twoja-nazwa.netlify.app` |

`REACT_APP_API_URL` jest wbudowywana w bundle **w trakcie builda**, więc po każdej
zmianie uruchom ponownie deploy z opcją *Clear cache and deploy site*.

### Jak to jest spięte

- `netlify.toml`: `/api/*` -> `/.netlify/functions/api/:splat`
- wszystkie pozostałe ścieżki -> `/index.html` (SPA + BrowserRouter)
- `netlify/functions/api.js` opakowuje aplikację Express przez `serverless-http`
  i normalizuje ścieżkę (obsługuje zarówno `/api/x`, jak i `/.netlify/functions/api/x`)

### Uruchomienie lokalne

- klasycznie: `npm start` (frontend, port 3000) + `npm run server` (API, port 4000)
  i w `.env` ustaw `REACT_APP_API_URL=http://localhost:4000`
- albo przez Netlify CLI: `npm i -g netlify-cli`, potem `npm run dev`
  (`netlify dev` uruchamia CRA + funkcję pod `/api`)

### Ograniczenia wynikające z serverless

- `express-rate-limit` trzyma licznik w pamięci instancji funkcji, więc limity są
  "miękkie" (kilka instancji = kilka niezależnych liczników).
- Funkcja ma limit czasu (domyślnie 10 s), a pierwsze żądanie po dłuższej przerwie
  może trwać dłużej (zimny start + łączenie z Atlas).
- Połączenie z MongoDB jest cache'owane w obrębie instancji; pula ograniczona do 5.

# Book My Show - Client

This is the frontend of the Book My Show application. It is built using Angular framework.

## Project Structure

The project structure is as follows:

book-my-show/client
├── src
│   ├── app
│   │   ├── components
│   │   │   └── header
│   │   │       ├── header.component.ts
│   │   │       ├── header.component.html
│   │   │       └── header.component.scss
│   │   ├── services
│   │   │   ├── api.service.ts
│   │   │   └── auth.service.ts
│   │   └── ...
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── ...
├── styles.scss
├── index.html
├── main.ts
├── angular.json
├── package.json
├── proxy.conf.json
└── ...


## Getting Started

To get started with the client application, follow these steps:

1. Install dependencies: Run `npm install` in the root directory.
2. Start the development server: Run `ng serve` in the root directory.
3. Open your browser and navigate to `http://localhost:4200/` to see the application.

## Project Configuration

- The `angular.json` file contains the project configuration, including build and serve settings.
- The `proxy.conf.json` file is used for proxying requests to the backend API during development.
- The `package.json` file contains the project's dependencies and scripts.

## Contributing

Contributions are welcome! Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](LICENSE).
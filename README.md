# bench-web

A simple web interface for ScalaMeter benchmarks

Note: It assumes the test scope is a **list**, instead of a **tree**.

## Development

Prerequisite: create a symbolic `data` under project root directory to the result directory of ScalaMeter.

- `npm install`
- `npm run watch`

## Deployment

Adapt the script `deploy` to the destination infrastructure.

- `npm run build`
- `sh deploy`



# bench-web

A simple web interface for Benchmarks

## Data Format

The data should be put in `data/`.

Example data format can be found [here](https://github.com/lampepfl/bench/tree/gh-pages/data):

- `charts.js`: specify meta data for charts
- `key.json`: hold data points for the line `key`

You can get test data from the live website:

```
g clone --depth 1 git@github.com:lampepfl/bench.git -b gh-pages site
cp -r site/data web/
```

## Development

- `npm install`
- `npm run watch`

## Deployment

- `sh deploy user@host:path/to/dest/`


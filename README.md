# Bench

Benchmarking Dotty

## Usage

- `bin/cron`: used for the cron job
- `bin/run`: for manually benchmarking a specific test for a specific period

Check the documentation in the source code of each command for more detail.

## Add Test

Update the two files below:

- `bin/charts.js`
- `bin/plan`

Use `bin/run` to manually benchmark the new tests for history periods.

## Dependencies

- [datamash](https://www.gnu.org/software/datamash/)
- npm
- NodeJS
- git
- sbt
- [ghi](https://github.com/stephencelis/ghi)


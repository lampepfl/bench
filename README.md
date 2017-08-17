# Bench

Benchmarking Dotty

## Usage

- `bin/cron`: used for the cron job
- `bin/run`: for manually benchmarking a specific test for a specific period
- `bin/pull`: for testing a specific pull request

Check the documentation in the source code of each command for more detail.

## Add Test

Update the two files below:

- `bin/charts.js`
- `bin/plan`

## Schedule a regression job

Put regression jobs as scripts under `jobs/`. 

## Dependencies

- [datamash](https://www.gnu.org/software/datamash/)
- [jq](https://stedolan.github.io/jq)
- sed
- cron
- npm
- NodeJS
- [ghi](https://github.com/stephencelis/ghi)
- git
- sbt


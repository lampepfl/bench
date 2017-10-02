# Bench

Benchmarking Dotty

## Usage

- `bin/master`: used for benchmarking the master
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

## Deployment

- Install all dependencies listed above
- Clone current project and its submodules, submodules of submodules
- Checkout the branch `gh-pages` of current project as a folder `site` under current project
- In `dotty` folder, run `git remote add staging https://github.com/dotty-staging/dotty.git`
- Update configuration in `bin/config`
- Setup cron jobs listed in `bin/cron`, run `bin/cpu` once, start `bin/poll` and `bin/queue`
- Authorize `ghi config --auth`, make sure it works from command line
- Make sure `git` can push to current project

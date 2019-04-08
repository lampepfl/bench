# Bench [![Build Status](https://travis-ci.org/liufengyun/bench.svg?branch=master)](https://travis-ci.org/liufengyun/bench)

Benchmarking Dotty

## Usage

- `bin/master`: for benchmarking the master
- `bin/run`: for manually benchmarking a specific period (after 2017.10.27)
- `bin/pull`: for testing a specific pull request

Check the documentation in the source code of each command for more detail.

## Add Test

Update the profiles below:

- `profiles/default.yml`
- `profiles/ci.yml`

## Schedule a job

- Put regression jobs as scripts under `jobs/`.
- Remember to use absolute path with the `$PROG_HOME` variable

The command `bin/run` does the above automatically, allowing
specify an interval by PR numbers, optionally with a step.
You may need to specify a custom plan, check `profiles/*.yml`.

## Development

- Put new test in relevant profiles under `profiles/*.yml`
- Make a pull request

## How to debug a test

```
cp profiles/default.plan profiles/scalapb.plan
# edit profiles/scalapb.plan to only keep the test relevant for debug

# run test with a PR and commit hash -- PR can be a random number
bin/gauge -p profiles/scalapb.plan  6179 54fb992
```

## Dependencies

- [jq](https://stedolan.github.io/jq)
- sed
- cron
- npm
- [ghi](https://github.com/stephencelis/ghi)
- git
- sbt
- [ecstatic](https://github.com/jfhbrook/node-ecstatic)

## Deployment

- Install all dependencies listed above
- Disable system update to use a fixed version of kernel

```
# edit file /etc/apt/apt.conf.d/10periodic
APT::Periodic::Update-Package-Lists "0";
APT::Periodic::Download-Upgradeable-Packages "0";
APT::Periodic::AutocleanInterval "0";
```

- Clone current project and its submodules, submodules of submodules
- Update configuration in `bin/config`
- Authorize `ghi config --auth`, make sure it works from command line
- Make sure `git` can push to current project
- Setup cron jobs listed in `bin/cron`
- Checkout the branch `gh-pages` of current project as a folder `site` under current project
- Make a git repo under the directory `data` for storing test data, make sure `git push origin master:master` works for the repo.
- In `dotty` folder, run `git remote add staging https://github.com/dotty-staging/dotty.git`
- run `bin/synch-profiles` once
- Run static web server for logs: `ecstatic ./logs --port 8000 --content-type text/plain`
- run `bin/cpu` once
- start `bin/poll` and `bin/queue` as long-running service

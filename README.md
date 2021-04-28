# Bench [![Build Status](https://travis-ci.org/lampepfl/bench.svg?branch=master)](https://travis-ci.org/lampepfl/bench)

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

Then run `bin/sync-profiles` to update the test files and json files.

## Schedule one test job

Put regression jobs as scripts under `jobs/`.

```
bin/gauge 6514 49f254a
```

The command `bin/gauge` accepts the following options:

- `-o File`: output file for test data, defaults to `FILE` in `bin/config`
- `-p PLAN`: the test plan to execute, defaults to `PLAN` in `bin/config`

To only measure a specific test target, just create a test plan for that test.

## Regressional benchmarks

The command `bin/run` allows schedule history benchmarks for a designated test target.
It accepts the following options:

- `-p PLAN`: the test plan to execute
- `-f PR`: from which PR (excluded)
- `-t PR`: to which PR (excluded)
- `-s STEP`: execute test plan every n pull requests, defaults to 0
- `-o FILE`: output file for test data, defaults to `FILE` in `bin/config`

The command only schedules the tasks under the directory `jobs/`, which will be executed
by the scheduler.

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
- [coursier](https://get-coursier.io)
- sed
- cron
- [ghi](https://github.com/stephencelis/ghi)
- git
- sbt
- [ecstatic](https://github.com/jfhbrook/node-ecstatic)

## Deployment

Current kernel: 4.4.0-78-generic #99-Ubuntu

- Install all dependencies listed above and make sure they are available in command line
- Disable system update to use a fixed version of kernel

```
# edit file /etc/apt/apt.conf.d/10periodic
APT::Periodic::Update-Package-Lists "0";
APT::Periodic::Download-Upgradeable-Packages "0";
APT::Periodic::AutocleanInterval "0";
```

- Clone current project, and under the project root:
  - `git clone git@github.com:lampepfl/dotty.git`
- Update configuration in `bin/config`
- Authorize `ghi config --auth`, make sure it works from command line
- Make sure `git` can push to current project
- Setup cron jobs listed in `bin/cron`
- Make a git repo under the directory `site` for displaying the charts
  * Make sure that the web server sets the HTTP header `Cache-Control: no-cache` (see [#1193][#1193])
  * Adapt the function `publish_site` in `bin/common`
- Make a git repo under the directory `data` for storing test data, make sure `git push origin master:master` works for the repo.
- In `dotty` folder, run `git remote add staging https://github.com/dotty-staging/dotty.git`
- Create a symbolic link: `ln -s dotty/bench/profiles profiles`
- Run static web server for logs: `ecstatic ./logs --port 8000 --content-type text/plain`
- run `bin/cpu` once
- start `bin/poll` and `bin/queue` as long-running service


[#1193]: https://github.com/lampepfl/bench/issues/1193

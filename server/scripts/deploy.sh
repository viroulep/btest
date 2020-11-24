#!/usr/bin/env bash

pull_latest() {
  git pull
}

rebuild_rails() {
  bundle install
  restart_app
}

restart_app() {
  if ps -efw | grep "puma" | grep -v grep; then
    # Found a puma process, restart it gracefully
    pid=$(<"/tmp/puma.pid")
    kill -SIGUSR2 $pid
  else
    # We could not find a unicorn master process running, lets start one up!
    bundle exec puma &
  fi
}
cd "$(dirname "$0")"/..

allowed_commands="pull_latest rebuild_rails restart_app"
source scripts/_parse_args.sh

# TODO
#https://stackoverflow.com/questions/15306770/postgresql-fatal-peer-authentication-failed-for-user-pgconnectionbad

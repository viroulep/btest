#!/usr/bin/env bash

pull_latest() {
  git pull
}

restart_app() {
  if ps -efw | grep "puma" | grep -v grep; then
    # Found a puma process, restart it gracefully
    pid=$(<"/tmp/puma.pid")
    kill -SIGUSR2 $pid
  else
    # We could not find a puma master process running, lets start one up!
    screen -A -m -d -S puma-prod bundle exec puma &
  fi
}

deploy() {
  sudo chef-solo -o 'role[btest-app]' -E production -c ../ci/chef/solo.rb
  set +x
  # Re-source env in case stuff changed
  source /home/btest/btest/env/envrc
  set -x
  restart_app
}

cd "$(dirname "$0")"/..

allowed_commands="restart_app deploy pull_latest"
source scripts/_parse_args.sh

#!/usr/bin/env bash

restart_app() {
  if ps -efw | grep "puma" | grep -v grep; then
    "Restarting puma"
    # Found a puma process, restart it gracefully
    pid=$(<"/tmp/puma.pid")
    kill -SIGUSR2 $pid
  else
    "Starting puma"
    # We could not find a puma master process running, lets start one up!
    bundle exec puma &
  fi
}

deploy_latest() {
  git pull
  sudo chef-solo -o 'role[btest-app]' -E production -c ../ci/chef/solo.rb
  # Re-source env in case stuff changed
  source /home/btest/btest/env/envrc
  restart_app
}

cd "$(dirname "$0")"/..

allowed_commands="restart_app deploy_latest"
source scripts/_parse_args.sh

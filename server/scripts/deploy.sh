#!/usr/bin/env bash

restart_app() {
  if ps -efw | grep "puma" | grep -v grep; then
    # Found a puma process, restart it gracefully
    pid=$(<"/tmp/puma.pid")
    kill -SIGUSR2 $pid
  else
    # We could not find a puma master process running, lets start one up!
    screen -A -m -d -S puma-prod bundle exec puma
  fi
}

restart_dj() {
  bin/delayed_job restart
}

deploy() {
  sudo chef-solo -o 'role[btest-app]' -E production -c ../ci/chef/solo.rb -l info
  restart_dj
  restart_app
}

# Simple proxy to make sure we get the latest version of the script to deploy
pull_deploy() {
  sudo chef-solo -o 'best::clone_repo' -E production -c ../ci/chef/solo.rb -l info
  scripts/deploy.sh deploy
}

cd "$(dirname "$0")"/..

allowed_commands="restart_app restart_dj deploy pull_deploy"
source scripts/_parse_args.sh

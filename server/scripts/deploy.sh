#!/usr/bin/env bash

restart_app() {
  if ps -efw | grep "puma" | grep -v grep; then
    echo "Restarting puma"
    # Found a puma process, restart it gracefully
    pid=$(<"/tmp/puma.pid")
    kill -SIGUSR2 $pid
  else
    # FIXME: somehow the server doesn't stay alive when started from ssh,
    # figure it out!
    # We could not find a puma master process running, lets start one up!
    bundle exec puma &
  fi
}

deploy_latest() {
  git pull
  sudo chef-solo -o 'role[btest-app]' -E production -c ../ci/chef/solo.rb
  set +x
  # Re-source env in case stuff changed
  source /home/btest/btest/env/envrc
  set -x
  restart_app
}

cd "$(dirname "$0")"/..

allowed_commands="restart_app deploy_latest"
source scripts/_parse_args.sh

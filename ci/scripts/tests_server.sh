#!/bin/bash
set -e

# The variable should be defined by the CI job, but set a default value to make
# this usable outside the CI context.
: ${GITHUB_WORKSPACE:=`dirname "$0"`/../..}
echo $GITHUB_WORKSPACE

export RAILS_ENV=test
# Runs the server tests
cd ${GITHUB_WORKSPACE}/server
# Make sure postgre is running

service postgresql status || sudo service postgresql start
[ ! -f .bundle/config ] && cat <<EOF > .bundle/config
---
BUNDLE_PATH: "vendor/bundle"
BUNDLE_JOBS: "3"
EOF
bundle install
bin/rails db:reset
set -x
bundle exec rubocop
bin/rails "test" "test"

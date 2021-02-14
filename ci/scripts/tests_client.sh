#!/bin/bash
set -e

# The variable should be defined by the CI job, but set a default value to make
# this usable outside the CI context.
: ${GITHUB_WORKSPACE:=`dirname "$0"`/../..}
echo $GITHUB_WORKSPACE

# Runs the client tests
cd ${GITHUB_WORKSPACE}/client
yarn install
set -x
yarn "test"
yarn "test:lint"
# Also make sure the build command works fine.
yarn build

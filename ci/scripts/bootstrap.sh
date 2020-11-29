apt-get update

export DEBIAN_FRONTEND=noninteractive

apt-get install -yq --no-install-recommends \
  apt-transport-https curl sudo wget ca-certificates

curl -L https://omnitruck.chef.io/install.sh | bash -s -- -v 16.7.61

# FIXME: run chef bootstrap, -E something, and make btest-bootsrap dynamically add
# environment-specific recipes

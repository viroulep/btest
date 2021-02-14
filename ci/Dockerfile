FROM debian:buster

RUN mkdir -p /tmp/bootstrap
WORKDIR /tmp/bootstrap
COPY scripts scripts
RUN ./scripts/bootstrap.sh

COPY chef chef
RUN chef-solo --chef-license accept-silent
RUN chef-solo -o 'role[btest-bootstrap-test]' -c chef/solo.rb -E test
RUN rm -rf /tmp/bootstrap
USER btest
WORKDIR /home/btest

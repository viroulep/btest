node.default['apt']['confd']['install_recommends'] = false
include_recipe "apt"

apt_package %w(git
               vim
               htop
               autoconf
               bison
               build-essential
               libssl-dev
               libyaml-dev
               libreadline6-dev
               zlib1g-dev
               libncurses5-dev
               libffi-dev
               libpq-dev
               gcc
               g++
               make
               postgresql
               screen
               rsync
               openssh-client
               man-db
               )

user "btest" do
  comment "basic user"
  home "/home/btest"
  manage_home true
  shell "/bin/bash"
end

sudo_users = ["btest"]

if node.chef_environment == "test"
  user "github" do
    comment "GitHub actions user"
    shell "/bin/bash"
    uid 1001
  end
  sudo_users << "github"
end

sudo "admin" do
  user sudo_users
  nopasswd true
end

template '/home/btest/.bashrc' do
  source 'bashrc.erb'
  owner "btest"
  group "btest"
end

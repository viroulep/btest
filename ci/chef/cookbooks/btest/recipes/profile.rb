template "/etc/profile.d/btest.sh" do
  source "profile"
  only_if { node.chef_environment == "production" }
end

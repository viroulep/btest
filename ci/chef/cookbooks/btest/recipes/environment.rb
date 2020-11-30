template "/etc/environment" do
  source "environment"
  only_if { node.chef_environment == "production" }
end

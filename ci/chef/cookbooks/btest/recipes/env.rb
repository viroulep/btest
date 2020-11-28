envfile = "/home/btest/btest/env/envrc"
template envfile do
  source "envrc.erb"
  sensitive true
  # We want to generate it just once!
  not_if { ::File.exist?(envfile) }
  owner "btest"
  group "btest"
end


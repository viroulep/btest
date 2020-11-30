# FIXME: as usual, this path should be set in some json "config" file.
envfile = "/home/btest/btest/server/.env"
template envfile do
  source "dotenv.erb"
  sensitive true
  # We want to generate it just once!
  not_if { ::File.exist?(envfile) }
  owner "btest"
  group "btest"
end

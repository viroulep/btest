# FIXME: it would be nice to start the server somewhere here
#"bin/rails s -p 8080 -b 0.0.0.0 &"
#ps -efw |grep "puma"|grep -v grep|tr -s ' ' |cut -f 2 -d " "
template "/home/btest/btest/server/.bundle/config" do
  source "bundle.erb"
  owner "btest"
  group "btest"
end

# FIXME: it would be nice to check the consistency of chef environment vs
# the one loaded by profile, and abort if inconsistent!
# FIXME: chef+sudo doesn't pick up /etc/profile.d/*, maybe we should set the
# env here instead of sourcing profile?!
bash "run the server actions" do
  cwd "/home/btest/btest/server"
  code <<-EOF
    source /etc/profile
    bundle install
    bin/rails db:create
    bin/rails db:migrate
  EOF
  environment ({ "HOME": "/home/btest" })
  user "btest"
end

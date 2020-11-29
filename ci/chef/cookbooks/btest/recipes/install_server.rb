# FIXME: it would be nice to start the server somewhere here
#"bin/rails s -p 8080 -b 0.0.0.0 &"
#ps -efw |grep "puma"|grep -v grep|tr -s ' ' |cut -f 2 -d " "
template "/home/btest/btest/server/.bundle/config" do
  source "bundle.erb"
  owner "btest"
  group "btest"
end

# FIXME: the environment is also set in envrc.
# It would be nice to check the consistency, and abort if inconsistent!
bash "run the server actions" do
  cwd "/home/btest/btest/server"
  code <<-EOF
    source /home/btest/btest/env/envrc
    bundle install
    bin/rails db:create
    bin/rails db:migrate
  EOF
  environment ({ "HOME": "/home/btest" })
  user "btest"
end

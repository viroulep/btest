# Make sure the environment makes sense
rails_env = node.chef_environment == "production" ? "production" : "development"

extra_args = "--without development test" if rails_env == "production"

# FIXME: it would be nice to start the server somewhere here
#"bin/rails s -p 8080 -b 0.0.0.0 &"
#ps -efw |grep "puma"|grep -v grep|tr -s ' ' |cut -f 2 -d " "

# FIXME: the environment is also set in envrc.
# It would be nice to check the consistency, and abort if inconsistent!
bash "run the server actions" do
  cwd "/home/btest/btest/server"
  code <<-EOF
    source /home/btest/btest/env/envrc
    bundle install --path vendor/bundle -j3 #{extra_args}
    bin/rails db:create
    bin/rails db:migrate
  EOF
  user "btest"
end

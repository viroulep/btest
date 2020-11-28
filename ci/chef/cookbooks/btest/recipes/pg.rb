# NEVER create a docker image including this recipe, as this leaves the user password in the image
# *Not* using chef's service since this is not run as root
service "postgresql" do
  action :restart
end

password=`openssl rand -base64 16`.chomp

user_exists=`sudo -u postgres psql -tAc "select 1 from pg_catalog.pg_roles where rolname='btest';"`.chomp

bash "create pg user 'btest'" do
  code <<-EOF
    sudo -u btest echo 'export BTEST_DATABASE_PASSWORD=#{password}' >> /home/btest/btest/env/env-db
    sudo -u postgres psql -c "create role btest login password '#{password}' createdb;"
  EOF
  not_if { user_exists == "1" }
  sensitive true
end

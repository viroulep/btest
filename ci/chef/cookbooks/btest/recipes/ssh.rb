apt_package "openssh-server"

bash "install authorized_keys" do
  cwd "/home/btest"
  user "btest"
  code <<-EOF
    tmp_authorized_keys_path="/tmp/authorized_keys"
    for user in viroulep; do
      public_keys_url="https://github.com/$user.keys"
      echo "" >> $tmp_authorized_keys_path
      echo "# Keys for $user" >> $tmp_authorized_keys_path
      curl -s $public_keys_url >> $tmp_authorized_keys_path
    done
    mkdir -p .ssh
    mv $tmp_authorized_keys_path .ssh/
  EOF
end

service "ssh" do
  action :restart
end

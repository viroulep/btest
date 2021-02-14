apt_package "openssh-server"

# This also installs the CI pubkey
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
    echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDPGOfxm3+MN9pKninVnfsav6eEiy2+Sq+rHNdj+kqSvVaGYC4eZI2BhJsNwSqEzor+N5lvTGjIHSOpB8WoXWH/uWNWAn6bUpArnUGl2wq/9dj+X0fhJDmwn/TtVYqAHJSRLPNiHAqqddd1pgwmoawoefcoubxbzAp3AiMeF77ZZcjBjq/Tm5+OvmThKA9x3vU4VbNuY69VkWQdYmXjYYDALKP4P2iE25mzArLeUVgW+C8YTJC2woQQyoUg8rVzLQWnWQUo4p7S2ynLtT5pjLp0m9Hz7SwW7LRgkRcBmbf3uftXH31jFqsrsQFwRlxKubq7WtZBr+TrrkrWsCveVjhd1jiAkuE8KHyBOFX9nspkh2qgssfJ8zK0Hz2GQwNETkIkQ4/P6beI2nWMTiwlCvl12mdUtH/yFiRG8gpuPtaFRZxanOQ5BvzScACbDJVXfXxq6VMYGNQLr7OYIBA1EJflMXK+m6tolMlGEymdnTGvDRQvw9No2Y4rP8Ydt7Y3AezQIqpIieN3b4sejr2bLDDpJ+9mTpVz7hB2rfPfBRoLbYQAgUMPgx2XMmruV+m8jpimKS5JT115mXS4kIiYHI2LfT+OnLlIoDYjmS9FWOn6LD2Pc1KV8nlfbOoF0n68Y+CiMUHDow97Jo3eX1nnW7Ki0sHjc/T1+4DEylrbFgtkuw==" >> $tmp_authorized_keys_path
    mkdir -p .ssh
    mv $tmp_authorized_keys_path .ssh/
  EOF
end

service "ssh" do
  action :restart
end

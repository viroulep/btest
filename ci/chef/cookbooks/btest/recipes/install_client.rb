# FIXME: this builds the client production, we should export the build directory
# as an artifact and deploy this to prod.
bash "run the client actions" do
  cwd "/home/btest/btest/client"
  code <<-EOF
    yarn install
    yarn build
  EOF
  user "btest"
end

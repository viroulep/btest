# This can be ran by any user to clone/update the repo

git "btest repo" do
  repository "https://github.com/viroulep/btest.git"
  destination "/home/btest/btest"
  revision "master"
  user "btest"
end

include_recipe "btest::dotenv"

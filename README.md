WIP

For prod: reinstall with debian 10 image, then:
```
scp -r ci user@server:/tmp
ssh user@ip
cd /tmp
sudo ./bootstrap.sh
sudo chef-solo -o 'role[btest-bootstrap-prod]' -E production -c chef/solo.rb
# set the oauth credentials in /home/btest/btest/server/.env.production
exit
ssh btest@quizz.virouleau.fr btest/server/scripts/deploy.sh pull_deploy
```
(basically the steps done in `ci/Dockerfile` to build the base image for the ci)

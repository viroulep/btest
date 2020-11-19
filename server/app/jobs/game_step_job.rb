class GameStepJob < ApplicationJob
  queue_as :default

  # FIXME: for applicationjob/activecable interaction, maybe make this
  # query the api on a private endpoint, and do the broadcast from there!
  def perform(next_url)
    puts "next url: #{next_url}"
    RestClient.get(next_url)
  end
end

# frozen_string_literal: true

class DeezerPlaylistsController < ApplicationController
  before_action :check_not_anon!

  def import_from_deezer
    playlist_id = params.require(:playlist_id)
    render json: RestClient.get(format(DeezerPlaylist::DEEZER_API_PLAYLIST_URL, id: playlist_id))
  rescue RestClient::ExceptionWithResponse => e
    render status: :bad_request, json: { error: e }
  end
end

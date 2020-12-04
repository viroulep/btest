# frozen_string_literal: true

class DeezerMixesController < ApplicationController
  before_action :redirect_unless_admin!, except: [:index]
  MIX_URL = "https://api.deezer.com/radio/%<id>s"

  def index
    @mixes = DeezerMix.all
  end

  def create
    id = params.require(:mix_id)

    # Get the mix data from deezer
    mix_response = RestClient.get(format(MIX_URL, id: id))
    data = JSON.parse(mix_response.body)

    raise RestClient::ExceptionWithResponse if data["error"].present?

    if DeezerMix.from_api(data)
      render json: { message: :ok }
    else
      render status: :bad_request, json: { message: "Couldn't save the mix!" }
    end
  rescue RestClient::ExceptionWithResponse => e
    render status: :bad_request, json: { message: e }
  end
end

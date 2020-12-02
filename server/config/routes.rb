# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  defaults format: :json do
    get "/auth/:provider/callback", to: "sessions#create"
    # This route is only used by the "developer" provider
    post "/auth/:provider/callback", to: "sessions#create" unless Rails.env.production?
    get "/signout", to: "sessions#destroy"
    resources :users, only: [:index, :show]
    get "/me" => "users#me"
    post "/updateMe" => "users#update_me"

    resources :games, only: [:index, :show, :create] do
      post "/attempt" => "games#attempt"
      post "/start" => "games#start"
      post "/next" => "games#next", as: :next
      post "/abort" => "games#abort"
      get "/my_answers" => "games#my_answers"
    end
  end
end

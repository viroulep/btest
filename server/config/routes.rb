Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  defaults format: :json do
    resources :users, only: [:index, :show]
    get '/me' => 'users#me'

    resources :games, only: [:index, :show] do
      get '/attempt' => 'games#attempt'
    end
  end
end

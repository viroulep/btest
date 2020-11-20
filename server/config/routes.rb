Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  defaults format: :json do
    resources :users, only: [:index, :show]
    get '/me' => 'users#me'

    resources :games, only: [:index, :show, :create] do
      post '/attempt' => 'games#attempt'
      post '/start' => 'games#start'
      post '/next' => 'games#next', as: :next
      post '/abort' => 'games#abort'
      get '/mine' => 'games#mine'
    end
  end
end

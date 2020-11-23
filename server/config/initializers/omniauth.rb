Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  provider :google_oauth2, ENVied.GOOGLE_CLIENT_ID, ENVied.GOOGLE_CLIENT_SECRET, scope: 'email,profile'
end
OmniAuth.config.allowed_request_methods = [:post]

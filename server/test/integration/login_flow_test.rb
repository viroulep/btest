# frozen_string_literal: true

require "test_helper"

class LoginFlowTest < ActionDispatch::IntegrationTest
  test "Sign in as anonymous by default" do
    get("/me")
    assert_response(:success)
    json = JSON.parse(response.body)
    assert_match(/anonymous_/, json["name"])
    assert(true, json["anonymous"])
  end
end

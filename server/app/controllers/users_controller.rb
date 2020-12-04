# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :redirect_unless_admin!, except: [:update_me, :me]

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  def update_me
    @user = current_user
    if @user.update(params.require(:user).permit(:name))
      render json: {
        success: true,
      }
    else
      render json: {
        success: false,
        message: @user.errors.values.join(","),
      }
    end
  end

  def me
    @user = current_user
    render :show
  end
end

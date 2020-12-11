# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :redirect_unless_admin!, except: [:update_me, :me]
  before_action :set_user!, only: [:show, :update]

  def index
    @users = User.all.order(:created_at)
  end

  def show
  end

  def update
    # For now the base allowed params is just :admin, but if we need more user
    # editing features it may change.
    @user.assign_attributes(params.require(:user).permit(:admin))
    json = if @user == current_user && @user.will_save_change_to_admin?
             {
               success: false,
               message: "Admins can't demote themselves, find someone else to do it",
             }
           elsif @user.save
             {
               success: true,
               message: "Successfully saved changes to user",
             }
           else
             {
               success: false,
               message: @user.errors.values.join(","),
             }
           end
    render json: json
  end

  def update_me
    @user = current_user
    if @user.update(params.require(:user).permit(:name, :locale))
      render json: {
        success: true,
        message: "Successfully saved your changes to your profile",
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

  private

  def set_user!
    @user = User.find(params[:id])
  end
end

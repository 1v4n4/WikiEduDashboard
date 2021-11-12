# frozen_string_literal: true
class QueueLatencyController < ApplicationController
  def short_latency
    answer = Sidekiq::Queue.new('short_update').latency
    render json: answer
  end

  def medium_latency
    answer = Sidekiq::Queue.new('medium_update').latency
    render json: answer
  end
end
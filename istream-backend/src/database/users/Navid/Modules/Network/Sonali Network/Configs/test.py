# import tweepy
# import time

import tweepy
consumerKey = "8TCxl5iPO9EYlT6jDApGH4Rrz"
consumerSecret = "mtWklT2YXiW0qgT5PqCOBiIZSp6TqmCRsjn2LpfLcvOMxGy8Q7"
bearerToken = "AAAAAAAAAAAAAAAAAAAAAKwThgEAAAAAxBL%2Fv9HjRlmfKYy8gPJKCXeUnPc%3DvG0I40l3ILWhCfSsze4JJiRN2TiUodMCrbBjmExOMK0PwW3o5v"
accessToken = "1015982702183550977-KNCsYD8ysHsF9om50RZxwzjqfY0RYd"
accessTokenSecret = "lfwvsXoY3qlTj92a2ccO6ZOcM6Fdd6wPtAKIObWkOXjr5"

# auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
# auth.set_access_token(accessToken, accessTokenSecret)

# api = tweepy.API(auth)


# def get_followers(screen_name):
#     print('Getting Follower list of ', screen_name)
#     followers = []
#     followers_screenNames = []
#     users = tweepy.Cursor(api.get_followers, screen_name='@' +
#                           screen_name, count=200)
#     for user in users.items():
#         try:
#             followers.append(user)
#             followers_screenNames.append(user.screen_name)
#         except tweepy.TweepError as e:
#             print("Going to sleep:", e)
#             time.sleep(60)

#     print('Fetched number of followers for '+screen_name+' : ', len(followers))
#     return followers, followers_screenNames

# get_followers("navid__ak")


# Authenticate to Twitter
# auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
# auth.set_access_token(accessToken, accessTokenSecret)
client = tweepy.Client(bearer_token=bearerToken, consumer_key=consumerKey,
                       consumer_secret=consumerSecret, access_token=accessToken, access_token_secret=accessTokenSecret)
# auth = tweepy.OAuth1UserHandler(
#     consumerKey, consumerSecret, accessToken, accessTokenSecret
# )
# auth = tweepy.OAuthHandler("CONSUMER_KEY", "CONSUMER_SECRET")
# auth.set_access_token("ACCESS_TOKEN", "ACCESS_TOKEN_SECRET")

# Create API object
# api = tweepy.API(auth)
# tweepy.

# Create a tweet
# api.update_status("Hello Tweepy")
# Define query
# query = 'from:BarackObama -is:retweet'
# username = client.get_user(id='1015982702183550977')

# # get max. 100 tweets
# # tweets = client.search_recent_tweets(query=query,
# #                                      tweet_fields=['author_id', 'created_at'],
# #                                      max_results=100)
# followers = client.follow_user(target_user_id='1015982702183550977')
# print(followers)

user_id = 1015982702183550977

# By default, only the ID, name, and username fields of each user will be
# returned
# Additional fields can be retrieved using the user_fields parameter
# response = client.get_users_followers(
#     user_id, user_fields=["profile_image_url"]
# )

# for user in response.data:
#     print(user.username, user.profile_image_url)

# response = client.get_users_followers(user_id, max_results=1000)

# print(len(response.data))

response = client.create_tweet(text="Test")

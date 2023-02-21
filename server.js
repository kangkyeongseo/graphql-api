import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "1",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "kyeongseo",
    lastName: "kang",
  },
];

const typeDefs = gql`
  """
  User object represents a resource for a User
  """
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstname + lastname as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    """
    Get all Tweets
    """
    allTweets: [Tweet!]!
    """
    Get a Tweet using id
    """
    tweet(id: ID!): Tweet
    """
    Get all Users
    """
    allUsers: [User!]!
  }
  type Mutation {
    """
    Post a Tweet
    """
    postTweet(text: String!, userId: ID!): Tweet
    """
    Deletes a Tweet if found, else return false
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const userExist = Boolean(users.find((user) => user.id === userId));
      if (!userExist) {
        console.log("User dose not exist");
        return;
      }
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      const author = users.find((user) => user.id === userId);
      return author;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

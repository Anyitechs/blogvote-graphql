const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server");
const { PubSub } = require("apollo-server");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();
const pubsub = new PubSub();

// Resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
    
      // updateLink: async (parent, args, context) => {
        //     const updateSingleLink = context.prisma.link.update({
        //         where: {id: parseInt(args.id)},
        //         data: {url: args.url, description: args.description}
        //     })
        //     return updateSingleLink;
        // },
        // deleteLink: async (parent, args, context) => {
        //     return context.prisma.link.delete({
        //         where: {
        //             id: parseInt(args.id)
        //         }
        //     })
        // }
    // Link: {
    //     id: (parent) => parent.id,
    //     description: (parent) => parent.description,
    //     url: (parent) => parent.url
    // }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, "schema.graphql"),
        "utf8"
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        }
    }
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );
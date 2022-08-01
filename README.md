# ![logo](https://raw.githubusercontent.com/Plazide/programrs.live/main/public/logo-32.png) Programrs

Programrs is a website that aims to gather programming streams from around the internet in one place. For the time being, only streams from [Twitch](https://twitch.tv) and [YouTube](https://youtube.com) are being showed.

## More sources

If you know any other sources of programming streams, feel free to open an issue so that we can start a discussion about adding it.

## Contributing

There are three easy ways to start contributing:
- Add Technologies in [src/models/technologies.ts](src/models/technologies.ts). This file contains searchable technologies and keywords for YouTube search.
- Add blocked channels in [src/models/blocklist.ts](src/models/blocklist.ts). This file contains channels that are should be filtered out due to various reasons.
- Add included channels in [src/models/includelist.ts](src/models/includelist.ts). This file contains lists of channels that should be always be included.

If you want to edit any of these lists, you are welcome to open a PR. If you have feature or improvement suggestions, please open an issue beforehand. 

### Developing


#### Clone
Clone the project:
```bash
git clone https://github.com/Plazide/programrs.live
```

#### Install
Install dependencies:
```bash
yarn install
# or
npm install
```

#### FaunaDB
You need to create a Fauna database. You can easily do this by going to the [Fauna dashboard](https://dashboard.fauna.com/) and clicking "NEW DATABASE".

This project uses [Fauna GQL Upload](https://github.com/Plazide/fauna-gql-upload). This means that we can create and update all of our database resources by running `yarn fauna` or `npm run fauna`. All you need is and admin secret for your database called `FGU_SECRET` in `.env.local`.

#### FaunaDB local

You could also create a local node, which I recommend that you do. This app consumes a lot of read and write operations, which might incur costs when using a cloud hosted instance of FaunaDB. See [Set up Fauna GQL Upload with Fauna Dev](https://blog.chjweb.se/set-up-fauna-gql-upload-with-fauna-dev) to learn how to run a local Fauna database.
```bash
npm i -g fauna-shell
docker pull fauna/faunadb:latest
fauna add-endpoint http://localhost:8443 --alias localhost --key secret
fauna create-database fauna-dev --endpoint=localhost
fauna create-key fauna-dev --endpoint=localhost
```
in .env.local
```shell
FGU_SECRET=[secret from the previous step]
```

in .fauna.json
```json
"region": "local"
```

```shell
docker start faunadb
```json


#### Environment variables
You need to create a file called `.env.local`.

Then check out the [.env.local.example](.env.local.example) to see the required environment variables. Among these variables are:
- `CLIENT_ID`. This is your Twitch `client_id` which you get from creating an application through the [Twitch developer console](https://dev.twitch.tv/console).
- `CLIENT_SECRET`. This is your Twitch `CLIENT_SECRET` which you also get from the [Twitch developer console](https://dev.twitch.tv/console).
- `GOOGLE_API_KEY`. This is an API key for making requests to the YouTube Data API. You can generate this key by going to your [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Don't forget to [enable the YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) for your project.
- `NEXT_PUBLIC_FAUNA_API_ENDPOINT`. This is the endpoint your FaunaDB instance. If you are running a cloud instance, this will be `https://db.fauna.com`. Local databases use `http://localhost:8443`.
- `NEXT_PUBLIC_FAUNA_GRAPHQL_ENDPOINT`. This is the endpoint of the FaunaDB GraphQL API. Use `https://graphql.fauna.com/graphql` for cloud instances, and `http://localhost:8084/graphql` for local instances.
- `NEXT_PUBLIC_GRAPHQL_KEY`. This is an API key with the role `public`. The `public` role is created when you run `yarn fauna` or `npm run fauna`.
- `FGU_SECRET`. This should be an admin key for your database. You can create this key in the security tab on your Fauna dashboard, or by following the [article](https://blog.chjweb.se/set-up-fauna-gql-upload-with-fauna-dev) mentioned above.
- `FGU_API_ENDPOINT`. This should be the same as `NEXT_PUBLIC_FAUNA_API_ENDPOINT` if you are running FaunaDB locally. This should only be present in development environments.
- `FGU_GRAPHQL_ENDPOINT`. This should be `http://localhost:8084` if you are running FaunaDB locally. This should only be present in development environments.

#### Run server

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

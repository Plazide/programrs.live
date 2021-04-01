# Programrs

Programrs is a website that aims to gather programming streams from around the internet in one place. For the time being, only streams from [Twitch](https://twitch.tv) are being showed. Streams from YouTube are planned.

## More sources

If you know any other sources of programming streams, feel free to open an issue so that we can start a discussion about adding it.

## Contributing

If you want to start contributing to this project, the easiest way is to add a technology. You can do this by going to [src/models/technologies.ts](src/models/technologies.ts).

Technologies are keywords which are used to identify which technologies are being used within a given stream. This is extracted from the title of the stream.

You can add aliases for a specific technology by making it an array, the first item of the array will be the name used in filtering options.

### Developing

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

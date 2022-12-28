This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You will need to fill the .env file with your own values. You can use the .env.example file as a template.

You will need docker and docker-compose installed on your machine.

```bash
# first launches
npm run build-dev
# other launches
npm run launch-dev
# Actualise dB (if needed)
# -> Connect to the studio container to run the following commands
 npx prisma migrate dev
 npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

Open [http://localhost:5555](http://localhost:555) with your browser to see prisma studio.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

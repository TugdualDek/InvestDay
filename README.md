# InvestDay platform

Creation of a fictitious trading platform for the InvestDay contest organized by the IsepInvest association.
It is possible to buy and sell stocks and cryptocurrencies with the real rates of the US market.
- Front-end and back-end made in NextJs
- Database made with Prisma and PostgreSql

## Images

![trade](https://github.com/TugdualDek/InvestDay/assets/35851118/f0ecf210-5154-4534-8441-72fc93bd1fa2)

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

## Authors

- **Hippolyte Bach**
- **Tugdual Audren de Kerdrel**

## Thanks

Special thanks to GarageISEP for their hosting services !

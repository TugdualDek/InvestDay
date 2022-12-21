cd /app
npx prisma generate > prismaGen.log &
npx prisma studio > prisma.log &
npm run dev
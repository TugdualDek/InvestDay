FROM node:16.15-alpine3.16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
# Install prisma
RUN npm ci

# Bundle app source
COPY . ./

# Build the app
# RUN npm run build
EXPOSE 3000
EXPOSE 5555
# generate prisma client

RUN npx prisma generate

CMD ["npm", "run", "dev"]

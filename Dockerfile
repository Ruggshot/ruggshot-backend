

FROM node:18-alpine 

# Create app directory
WORKDIR /usr/src/app


COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

RUN npm run dev
# Use the node user from the image (instead of the root user)
USER node
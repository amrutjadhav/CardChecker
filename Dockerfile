FROM node:10

LABEL maintainer="Amrut Jadhav <amrutjadhav2294@gmail.com>"

# Create app directory
RUN mkdir /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

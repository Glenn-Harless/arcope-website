FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

# Copy package files first
COPY package*.json ./

# Regular npm install
RUN npm install

# Copy the rest of the application
COPY . .

# Add these flags to the start command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
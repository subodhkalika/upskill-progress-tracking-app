# Use a Node.js base image for building React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Nginx image for serving the built app in production (or for testing)
# For development, the React dev server will handle serving.
FROM nginx:alpine AS production-stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# For development, you'll primarily use the Node.js dev server, so the
# `production-stage` is for later deployment. For now, the `build` stage
# sets up dependencies. The `docker-compose.yml` will run `npm start`
# in the frontend container directly.
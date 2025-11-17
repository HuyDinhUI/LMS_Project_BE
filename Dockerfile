FROM node:18
WORKDIR /LMS_Project_BE
COPY LMS_Project_BE/package*.json ./
RUN npm install
COPY LMS_Project_BE/. ./
CMD ["npm", "start"]

FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY Worker.java .

RUN javac Worker.java

CMD ["java", "Worker"]

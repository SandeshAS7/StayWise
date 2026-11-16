# StayWise Spring Boot Backend Dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/staywise-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

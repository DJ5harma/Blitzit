FROM ubuntu:22.04

# Install Java and common tools
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    findutils \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Set Java environment (optional but nice)
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

WORKDIR /app
COPY App.java .

CMD ["java", "App.java"]

FROM gcc:13.2.0

WORKDIR /app
COPY app.cpp .

RUN g++ -o app app.cpp

CMD ["./app"]
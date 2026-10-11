const { io } = require("socket.io-client");

const PIN = process.argv[2];
const TARGET_CONNECTIONS = 60;

if (!PIN) {
  console.error("Error: You must provide an active PIN. (e.g., node load-test.js 123456)");
  process.exit(1);
}

console.log(`Initiating concurrency strike on Session PIN: ${PIN} with ${TARGET_CONNECTIONS} simultaneous users...`);

const clients = [];
let connectedCount = 0;

for (let i = 0; i < TARGET_CONNECTIONS; i++) {
  const socket = io("http://localhost:3000");
  clients.push(socket);

  socket.on("connect", () => {
    socket.emit("join_session", { pin: PIN });
    connectedCount++;
    
    if (connectedCount === TARGET_CONNECTIONS) {
      console.log(`All ${TARGET_CONNECTIONS} clients connected. Firing simultaneous payloads...`);
      
      // Fire all 60 answers in the exact same millisecond
      clients.forEach((c, index) => {
        c.emit("submit_answer", { 
          pin: PIN, 
          studentId: `stress-test-bot-${index}`, 
          answer: "Yes" 
        });
      });

      console.log("Payloads delivered. Check your Professor Console.");
      setTimeout(() => process.exit(0), 3000);
    }
  });
}

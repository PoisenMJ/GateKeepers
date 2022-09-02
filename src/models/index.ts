import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(process.env.DB_URI);
}

main().then(() => {
  // tslint:disable-next-line:no-console
  console.log("MongoDB Connected...");
})
.catch(() => {
  // tslint:disable-next-line:no-console
  console.warn("Error connecting to MongoDB.");
});

// compile models
import "./users";
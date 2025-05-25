import mongoose from "mongoose";
import dotenv from "dotenv";
import Chat from "../model/chatModel.js"; // Adjust path if needed

dotenv.config();

const channelData = [
  {name:'Pobitro', profilePic:'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
  // { name: "IIT Bhilai", profilePic: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/IIT_Bhilai_Logo.svg/1200px-IIT_Bhilai_Logo.svg.png" },
  // { name: "Coding-help", profilePic: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fingenuity-iit-bhilai&psig=AOvVaw1DKiRp5K2Ztjw8d7jrAV18&ust=1747680109622000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOiVuvLVrY0DFQAAAAAdAAAAABAE" },
  // { name: "Memes", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB0rYRW_jUaBmVeX6rwDX60-xfnhmzlzMjqQ&s" },
  // { name: "Placement-prep", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQuMvkgioc9f4cpmBQl7yh0BumBm_L3ea-1w&s" },
  // { name: "Event-updates", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtDWockkuQaqckSkVUt2LgecElgCN_-_mqvA&s" },
  // { name: "Study-resources", profilePic: "https://repository-images.githubusercontent.com/389729275/371ba38b-8a03-4bff-916c-c3fa5396ceda" },
  // { name: "Doubt-solving", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe5Lrpjfwe9mK0d_9EU7Uw5bbAuBPIc4QDMg&s" },
  // { name: "Hostel-life", profilePic: "https://polaris.iitbhilai.ac.in/public/images/hostel%20images/7.jpg" },
  // { name: "Random-talks", profilePic: "https://www.google.com/url?sa=i&url=https%3A%2F%2Frandom-talk.bd.aptoide.com%2Fapp&psig=AOvVaw2T6AKJLQLTixcub0c1mtAO&ust=1747680524212000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMitnbjXrY0DFQAAAAAdAAAAABAE" },
];

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://aviralsaxena2006:WVYis3UqHDMsZVLC@cluster0.elh7l9d.mongodb.net/campus_connect?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedChannels = async () => {
  await connectDB();

  for (const ch of channelData) {
    await Chat.updateOne(
      { name: ch.name },
      {
        name: ch.name,
        chatName: ch.name,
        isChannel: false,
        profilePic: ch.profilePic,
      },
      { upsert: true }
    );
  }

  console.log("✅ Channel data seeded successfully!");
  process.exit();
};

seedChannels();

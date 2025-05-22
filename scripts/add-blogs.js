// Script to add static blog articles to the database
require('dotenv').config(); // Load environment variables
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const axios = require('axios');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define Blog Schema
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      trim: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// Function to upload an image to Cloudinary
const uploadToCloudinary = async (imagePath, folder = 'blogs') => {
  try {
    console.log(`📤 Uploading ${imagePath} to Cloudinary...`);
    
    // If it's a URL, upload directly
    if (imagePath.startsWith('http')) {
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: folder,
        resource_type: 'image'
      });
      return {
        url: result.secure_url,
        cloudinary_id: result.public_id
      };
    }
    
    // If it's a local file path, check if it exists
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Image file not found: ${fullPath}`);
    }
    
    // Upload the local file
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: folder,
      resource_type: 'image'
    });
    
    return {
      url: result.secure_url,
      cloudinary_id: result.public_id
    };
  } catch (error) {
    console.error(`❌ Cloudinary upload error for ${imagePath}:`, error);
    throw error;
  }
};

// Function to create a blog post
const createBlog = async (blogData) => {
  try {
    console.log(`⏳ Creating blog: ${blogData.title}`);
    
    // Upload image to Cloudinary
    const imageUpload = await uploadToCloudinary(blogData.img);
    
    // Prepare the blog data with Cloudinary info
    const blog = new Blog({
      ...blogData,
      img: imageUpload.url,
      cloudinary_id: imageUpload.cloudinary_id
    });
    
    // Save to database
    await blog.save();
    console.log(`✅ Blog created: ${blogData.title}`);
    return blog;
  } catch (error) {
    console.error(`❌ Error creating blog: ${blogData.title}`, error);
    throw error;
  }
};

// Blog articles data
const blogArticles = [
  {
    title: "Discover the Profound Benefits and Transformative Power of a Conscious Prayer Routine",
    description: "The human mind runs on two modes, one is conscious and the other is subconscious. For an average human being, 95% of the time during their state of wakefulness, the subconscious mind operates, and barely 5% the conscious mind comes to play.",
    content: `<p>
      The human mind runs on two modes, one is conscious and the other is subconscious. For an average human being, 95% of the time during their state of wakefulness, the subconscious mind operates, and barely 5% the conscious mind comes to play. To understand the conscious mind, we need to first understand the subconscious mind a little deeper. Let's look into the activities that the subconscious mind operates with,
    </p>
    <ol>
      <li>
        When you wake up from bed, you get down in a specific manner and walk to the bathroom and brush your teeth in a specific way only, and this is not something you are doing will fully, but it is happening. Just like every day morning. This happens because your subconscious mind has an imprint of this program (waking up and brushing your teeth) and it happens just as it happens all the time even when your mind during an early morning is wandering at your boss's office or somewhere more stressful.
      </li>
      <li>Another example of a subconscious mind activity is driving a car or riding a motor bike. When you are on the steering wheel, you turn, clutch, brake, accelerate, look in the rare view mirror without you even thinking about it again while your mind is wandering somewhere else. Since you have done this so many times, now your sub conscious mind can do it by itself without any of your assistance.</li>
      <li>If you are an angry and grumpy adult, and walking on a street and someone accidently stamped your feet, and you immediately cuss out all the dictionary in your mind with out thinking if it was an accident or a pure mistake. This is the subconscious mind being trained to respond in this way. Now if you were a conscious being, you would stop for a moment and think if the other person totally did not intend to hurt you and is apologetic and you just smile and walk away consciously choosing to not spoil the rest of your day. </li>
    </ol>
    <p>Using the subconscious mind for mundane activities is fine, but to take important life decisions, one must have a trained conscious mind. When your mind is conscious, your mind detaches from all the subconscious activity and the energy it is depleting towards mental tasks that are not even important.</p>
    <p>Now applying the same understanding to praying Namaz, we understand that when most people prepare for offering a Namaz, they simply walk into a masjid with a mind that is still occupied with mundane tasks and rush to offer Wuduh. They simply sit with their hands under running water thinking how bad their day was and the subconscious mind does the ritual of washing the hands, ears, head, face, arms and feet just without one even noticing. Wuduh itself is a very important part of the Namaz, your Namaz technically starts at the point you start offering Wuduh. When one is offering Wuduh, one should empty their mind and become conscious of the water cleansing the face, hands and feet, while reciting the Wuduh Dwa being fully conscious. This way you are first cleansing every drop of water with the vibration of the powerful Dwa and then letting that water absorb in your skin and body. Once you are done offering Wuduh you should keep a conscious effort to keep your mind empty and proceed for offering the Namaz.</p>
    <p>Now when you stand to begin with offering Namaz with an empty mind, you will have the capability to surrender your focus on every verse that is recited by you or the one hosting the prayer. If you have your mind still occupied by thoughts of every thing else but Namaz, every sacred and powerful vibration of the versus from the holy Quran will just reach your ear but not your mind and spirit, while the main purpose of the Namaz ritual is to cleanse your mind, body and spirit and raise your vibrations to create space for receiving all the blessings from Allah that you desire.</p>
    <p>Most people think once the Namaz is finished the ritual is completed, but it is not true. The Namaz ritual is supposed to be followed by a closed eye meditation while being seated, where one has to recite various powerful Dwa's and Surah's and recite Alhamdulillah, Allahu Akbar and Subhan Allah for 33 times each, in a very specific way, again "while keeping" the mind empty from any worldly business (to reap maximum benefit).</p>`,
    slug: "discover-benefits-of-conscious-prayer",
    img: "/images/insights/img-lg-1.jpg",
    readTime: "15 min",
    published: true,
    featured: true
  },
  {
    title: "The power of conscious Namaz to heal the mind, body and spirit and power of Quranic recitations and vibrations",
    description: "Delve into the numerous benefits of maintaining a consistent prayer routine. From mental well-being to spiritual growth, see how regular prayer can positively impact various aspects of your life.",
    content: `<p>The reason why Namaz is considered to be a very important ritual in Islam is because of the power it carries. This ritual is dawned upon mankind to perform for minimum of five times a day for not just virtues reasons but also for helping one live this life being healthy, wealthy, joyful and protected. The common way of praying using the subconscious mind barely even reaches the ear without even touching the mind and spirit. Each and every verse and letter from the Holy Quran is designed by Allah in a way that when recited consciously and vibrationally, leads to massive healing beyond one's imagination. Let's look at what happens to the body, mind and spirit when the Quranic recitations are performed being fully conscious.</p>
    <h3>BODY</h3>
    <p>When one recites the verses from the Holy Quran consciously and vibrationally feeling the energy of each verse run through their hands into the chest, the human body on the physical level heals (because all the energy centres of the body are connected to our nerve plexus majorly intersecting around the chest region). That is one of the main reasons why we are commanded by Allah to place the palm of both our hands overlapped on to our mid chest while offering Namaz.</p>
    <h3>MIND</h3>
    <p>The mind is one of the most disturbed function in lives of many. We all know if we heal our mind, we transform our life. The mind is very powerful, powerful enough to change your life for the better merely overnight, if cleansed and harnessed in the right way.  While you perform your Namaz and recitations consciously, your intentionally keep your mind in a state of emptiness. This state of emptiness is responsible for healing the mind from compulsive toxicity and helps you become more conscious. Science proves that an average human mind runs 60 to 80 thoughts per minute, which to the scientific community looks like a disaster in one's head. Once we start offering namaz and Qur'anic recitations consciously and vibrationally, the mind starts to heal, heal from a disastrous 60-80 thoughts per minute to 50, 40, 30 and eventually less. When this cycle of thoughts reduces, we start to save up the energy that was draining towards all those thoughts and redirect that energy towards healing and manifesting what we desire.</p>
    <h3>SPIRIT</h3>
    <p>When we talk about vibrations, we are talking about something that is deeply connected to our spiritual world. If you have been fortunate to witness any Islamic exorcism, you would definitely know the power or Qur'anic verses upon dark spiritual entities. Every word and letter in the holy Quran are vibrationally very very powerful to cleanse and protect us from any spiritual grounds. Regularly offering our Namaz consciously helps us protect ourselves spiritually and definitely helps us towards keeping our vibrations high and when we keep our vibrations high, we keep all the doors open to receive all the blessings from Allah that we desire to manifest.</p>`,
    slug: "power-of-conscious-namaz",
    img: "/images/insights/img-lg-2.jpg",
    readTime: "12 min",
    published: true,
    featured: false
  },
  {
    title: "Why is the post Namaz meditation very important?",
    description: "Learn about the mental and spiritual benefits of maintaining a consistent prayer routine.",
    content: `<p>As important and sacred the Wuduh is, the last part of the Namaz ritual is equally important. The closed eyed meditation that is suppose to be performed right after offering Namaz holds a very powerful significance is terms of manifesting health wealth and prosperity. Generally, this ritual is performed in a very subconscious way. One just sits with their eyes closed and like a robot repeat every sacred text verbally with out feeling the vibration of the word or even the meaning. At conscious Namaz we make this last part of the ritual as meaningful and powerful as the first two. Though all the three words are powerful among Alhamdulillah, Allahu Akbar and Subhan Allah, my personal favourite is Alhamdulillah, because this is the best way to be grateful and I believe we have plenty of reasons to be grateful for in life, it's just that we tend to forget the blessings and remember our miseries.</p>
    <p>A recent study at a prestigious university in the United States claimed that just by thinking and visualising thoughts of events you felt blessed and grateful about for two to three times a day (for 9 minutes each) helped research participants to increase the amount of Immunoglobin (IgA- a hormone responsible for immunity in the human body) by a large number. Which means this ritual of reciting alhamdulillah for 33 times is suppose to be performed with more depth to it. Every time you recite alhamdulillah, you are supposed to think of one single thing that Allah has blessed you with while you feel the energy of gratitude deep within you. Similar to the word "Alhamdulillah" carrying the vibration of gratitude, "Subhan Allah" carries the vibration of every bit of creation Allah has bestowed upon mankind. Thus, the best way to recite Subhan Allah being fully conscious is to visualize the breath-taking nature Allah has created all around us. The medical community today claims that if we ground ourselves to nature a strong healing triggers with in the human body. So, every time I recite Subhan Allah, while being in a state of post Namaz meditation or if I am experiencing a beautiful landscape of nature or may be just a simple tree on my backyard, I deeply feel blessed to be around every bit of Allah's creation. Allahu Akbar on the other hand carries a very powerful vibration too. It is difficult to say which one could be more significant over the other when compared to all three. Allahu Akbar reminds us of Allah's capability to protect us, to save us, to guide us. Hence every time we recite Allahu Akbar, we should visualize an event when we received some miraculous help, when we were saved by some tragic accident, when we took the perfectly right decision intuitively etc, all this happened because Allah is all giving, the mighty, the powerful.</p>
    <p>Only if all these three powerful words are recited consciously and with a  deep connection with them, we will forever be healthy wealthy and protected.</p>`,
    slug: "importance-of-post-namaz-meditation",
    img: "/images/insights/img-lg-3.jpg",
    readTime: "8 min",
    published: true,
    featured: false
  }
];

// Main function to add blogs
const addBlogs = async () => {
  try {
    await connectToDatabase();
    
    console.log('Starting to add blogs to database...');
    
    for (const blogArticle of blogArticles) {
      // Check if blog with same slug already exists
      const existingBlog = await Blog.findOne({ slug: blogArticle.slug });
      
      if (existingBlog) {
        console.log(`⚠️ Blog with slug "${blogArticle.slug}" already exists, skipping...`);
        continue;
      }
      
      await createBlog(blogArticle);
      // Small delay to prevent overwhelming API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ All blogs have been added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding blogs:', error);
    process.exit(1);
  }
};

// Run the script
addBlogs(); 
// Script to add fallback reviews to the database
// Run this script with Node.js

const reviews = [
    {
        img: "/images/reviews/img-1.webp",
        rating: 5,
        name: "Zahid pathan",
        email: "zahid@example.com",
        title: "Businessman",
        description: "Testimonial from a Businessman",
        review: "Firstly, I was thrilled by the knowledge I got to learn from the course, secondly it made me realise the right way to pray and ask Allah for my wishes and dwas. It's impossible to believe the success i achieved in my life after the program.",
        approved: true
    },
    {
        img: "/images/reviews/img-2.webp",
        rating: 5,
        name: "Nusrath khan",
        email: "nusrath@example.com",
        title: "Engineer",
        description: "Testimonial from an Engineer",
        review: "I took this course, just because I am Muslim and thought I will gain some sawaab by attending it. But I was wrong. This course made me see Islam in a way no one could ever help me see.",
        approved: true
    },
    {
        img: "/images/reviews/img-3.webp",
        rating: 5,
        name: "Safiuddin",
        email: "safiuddin@example.com",
        title: "Student",
        description: "Testimonial from a Student",
        review: "Assalamualaikum everyone. Being Hafez e Qur'an my self, i was still unaware of the real beauty of namaz and Islam. I am forever grateful for this program. Alhamdulillah!",
        approved: true
    },
    {
        img: "/images/reviews/img-4.webp",
        rating: 5,
        name: "Zaid Nasrullah",
        email: "zaid@example.com",
        title: "Architect",
        description: "Testimonial from an Architect",
        review: "A colleague suggested me to attend one session of the tahajjud program because I was praying restlessly to Allah to make one very important thing in my life to fall in place for months. The approach the tahajjud namaz program had towards dua and manifestations blew my mind. In just three days of praying and offering dwa in the conscious way flipped everything in my life like big blessing.",
        approved: true
    },
    {
        img: "/images/reviews/img-5.webp",
        rating: 5,
        name: "Sumayya k",
        email: "sumayya@example.com",
        title: "House wife",
        description: "Testimonial from a House wife",
        review: "Just by praying namaz the right way, made a world of difference in my life. It made me understand the real purpose of tahajjud namaz and how it makes all dwa's that I ask Allah at night come to me in real life.",
        approved: true
    },
];

// Function to add a single review
async function addReview(review) {
    try {
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Review from ${review.name} added successfully`);
        } else {
            console.error(`❌ Failed to add review from ${review.name}: ${data.message}`);
        }
    } catch (error) {
        console.error(`❌ Error adding review from ${review.name}:`, error);
    }
}

// Function to add all reviews
async function addAllReviews() {
    console.log('Starting to add reviews...');
    
    for (const review of reviews) {
        await addReview(review);
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('Finished adding reviews!');
}

// Run the function
addAllReviews(); 
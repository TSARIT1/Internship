import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InternshipCards from '../components/InternshipCards';
import Testimonials from '../components/Testimonials';
import Advantage from '../components/Advantage';
import Technologies from '../components/Technologies';
import Footer from '../components/Footer';

import VideoTestimonials from '../components/VideoTestimonials';
import Hackathon from '../components/Hackathon';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
            <Header />
            <main>
                <Hero />
                <Advantage />
                <InternshipCards />
                <Hackathon />
                <VideoTestimonials />
                <Testimonials />
                <Technologies />
            </main>
            <Footer />
        </div>
    );
};

export default Home;

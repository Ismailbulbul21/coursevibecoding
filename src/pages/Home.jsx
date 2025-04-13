import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    // Get up to 3 published courses to feature on the home page
    if (courses && courses.length > 0) {
      setFeaturedCourses(
        courses
          .filter(course => course.is_published)
          .slice(0, 3)
      );
    }
  }, [courses]);

  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="gradient-dark text-[#F0F4F8] py-24">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 font-montserrat">Xirfadaada Horumar Ka Gaadh</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
            Hel koorsooyin tayo leh oo ay dhigaan khuburada xirfadleyda ah. Waxbaro xawaare kuu gaar ah oo horumar ka gaadh xirfadaada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/courses" 
              className="btn-secondary text-lg px-8 py-3"
            >
              Fiiri Koorsooyinka
            </Link>
            <Link 
              to="/register" 
              className="btn-accent text-lg px-8 py-3"
            >
              Iska Diiwaan Geli
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-montserrat text-[#1C2A3A]">Koorsooyinka La Doorbiday</h2>
            <div className="w-20 h-1 bg-[#5E97F2] mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-[#687787] max-w-2xl mx-auto">
              Waxbarasho tayo leh oo aad ku horumarinayso xirfadaada
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#5E97F2]"></div>
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#687787] py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p className="text-lg">Wali ma jiraan koorsooyin. Dib u soo fiiri!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-[#5E97F2] font-semibold hover:text-[#3D7AE4] transition-colors"
            >
              Arag Dhammaan Koorsooyinka
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-montserrat text-[#1C2A3A]">Sida Ay U Shaqeyso</h2>
            <div className="w-20 h-1 bg-[#61DAFB] mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-[#687787] max-w-2xl mx-auto">
              Si fudud oo sahlan ayaad u bilaabayn kartaa waxbarashadaada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="bg-[#3D7AE4]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#5E97F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1C2A3A]">Raadi Koorsooyinka</h3>
              <p className="text-[#687787]">
                Baadh katalogkeena oo hel koorsooyin tayo leh oo loo qaabeeyay in ay kaa caawiyaan barashada xirfado cusub.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="bg-[#3D7AE4]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#5E97F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1C2A3A]">Samee Lacag Bixinta</h3>
              <p className="text-[#687787]">
                Soo gudbi faahfaahinta lacag bixintaada kadibna sug xaqiijinta maamulaha si aad u hesho gelitaanka koorska.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="bg-[#3D7AE4]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#5E97F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1C2A3A]">Bilow Waxbarashada</h3>
              <p className="text-[#687787]">
                Markii la xaqiijiyo lacag bixintaada, gal qaybaha koorska oo bilow waxbarasho xawaare kuu gaar ah.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="gradient-blue text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 font-montserrat">Ma U Diyaar Garoowday Waxbarashada?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Ku biir boggeena maanta oo hel koorsooyin tayada leh oo kaa caawin doona horumarinta xirfadaada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-[#5E97F2] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-lg"
            >
              Iska Diiwaan Geli
            </Link>
            <Link 
              to="/courses" 
              className="bg-[#121A24] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#2A3744] border border-white/20 transition duration-300 text-lg"
            >
              Fiiri Koorsooyinka
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import axios from 'axios';
import { format } from 'date-fns';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blog`);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <DashboardLayout title="Insights & Case Studies">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl h-96 animate-pulse" />
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-500">No stories yet.</h3>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col"
              >
                {post.image && (
                  <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-[10px] font-bold rounded-full uppercase">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                        {post.author?.fullName ? post.author.fullName.charAt(0) : '?'}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {post.author?.fullName || 'Anonymous'}
                      </span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
                      Read More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogList;
